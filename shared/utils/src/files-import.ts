import type {EntryInfo, ReaddirpOptions} from 'readdirp';
import readdirp from 'readdirp';

interface IImportFiles {
  path: string;
  options: ReaddirpOptions;
}

interface IReturn<T> {
  data: T;
  path: string;
}

export const importFiles = <T>({
  options,
  path
}: IImportFiles): Promise<IReturn<T>[]> => {
  return new Promise((resolve) => {
    const files: Promise<IReturn<T>>[] = [];
    readdirp(path, options)
      .on('data', async (entry: EntryInfo) => {
        const {fullPath, path} = entry;
        files.push(
          new Promise((resolve) => {
            import(fullPath).then((file) => {
              resolve({
                data: file.default,
                path
              });
            });
          })
        );
      })
      .on('end', () => {
        Promise.all(files).then((data) => {
          resolve(data);
        });
      });
  });
};
