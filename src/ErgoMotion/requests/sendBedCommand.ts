import { intToBytes } from '@utils/intToBytes';
import { Credentials } from '../options';
import { Commands } from '../types/Commands';
import { getAuthDetails } from './getAuthDetails';
import { getConnection } from './tcpConnection';
import { TcpPayloadBuilder } from './TcpPayloadBuilder';

export const sendBedCommand = async (command: Commands, user: Credentials, id: number) => {
  const authDetails = await getAuthDetails(user);
  if (!authDetails) return;

  const { userId, authorize } = authDetails;
  const socket = await getConnection((socket) => socket.write(loginPayload(userId, authorize)));
  socket.write(commandPayload(id, command));
};

const loginPayload = (userId: number, authorize: string) => {
  return new TcpPayloadBuilder(authorize.length + 10, 1)
    .addByte(3)
    .addInt(userId)
    .addShort(authorize.length)
    .addString(authorize)
    .addByte(0)
    .addShort(180)
    .build();
};

let lastMessageId = 0;
const getMessageId = () => {
  if (lastMessageId == 0 || lastMessageId >= 64000) {
    lastMessageId = (Math.trunc(Math.random() * 64000) % 63001) + 1000;
  }
  return (lastMessageId += 1) - 1;
};

export const getCommandBytes = (command: Commands) => {
  const commandBytes = [0x4, 0x1, ...intToBytes(command).reverse()];
  const checksum = commandBytes.reduce((acc, curr) => (acc += curr), 0);
  return [0xaa, 0x3, 0x0, 0x0f, 0x0, 0x12, 0x23, 0x34, 0x45, 0x0, 0x0, ...commandBytes, ~checksum, 0x40, 0x55];
};

const commandPayload = (id: number, command: Commands) => {
  const commandBytes = getCommandBytes(command);
  return new TcpPayloadBuilder(commandBytes.length + 7, 7)
    .addInt(id)
    .addShort(getMessageId())
    .addByte(0)
    .addBytes(commandBytes)
    .build();
};
