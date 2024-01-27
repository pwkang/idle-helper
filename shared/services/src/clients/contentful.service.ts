import * as contentful from 'contentful';

export const contentfulService = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? ''
});
