import Config from '../../config';

class ChangeFileManager {
  private _files: string[] = [];
  private _pristine = true;

  get lastChangedFiles() {
    return this._files.slice();
  }

  get pristine() {
    return this._pristine;
  }

  addFile(file: string) {
    this._pristine = false;
    this._files.push(file);
  }

  addFiles(files: string[]) {
    files.forEach(f => this.addFile(f));
  }

  clear() {
    this._files = [];
  }
}

export let changeFileManager = new ChangeFileManager();


/**
 * Runs tiny-lr as the listening process for the application.
 */
let liveReloader: any;
let setLiveReloader = (tinylr: any) => {
  liveReloader = tinylr;
};

/**
 * Provides a flag to mark which files have changed and reloads tiny-lr accordingly.
 */
let changed = (files: any) => {
  if (!liveReloader) {
    console.log('>> not set liveReloader - tiny-lr - yet.');
    return;
  }

  if (!(files instanceof Array)) {
    files = [files];
  }

  liveReloader.changed({
      body: {
        files: files
      }
  });
};

export { setLiveReloader, changed };
