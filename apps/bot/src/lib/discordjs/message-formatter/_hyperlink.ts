interface IHyperlink {
  text: string;
  url: string;
}

export const _hyperlink = ({text, url}: IHyperlink) => {
  return `[${text}](${url})`;
};
