interface IInterpolateMessage {
  message: string;
  variables: Record<string, string>;
}

export const interpolateMessage = ({
  message,
  variables
}: IInterpolateMessage) => {
  const regex = /{([^}]+)}/g;

  // remove the markdown wrapper if matched values is empty string
  const replace = (match: string, p1: string) => variables[p1] || '';

  return message.replace(regex, replace);
};
