export default interface IChannel {
  uid: string;
  name: string;
  admin: string;
  description: string;
  members: string[];
  isPrivate: boolean;
}
