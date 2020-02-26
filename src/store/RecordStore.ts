import { VuexModule, Action, Module, Mutation } from 'vuex-class-modules';
import { IAction } from 'drawify/lib/Interfaces/ActionInterfaces';
import Auth from '@/utils/Auth';
import { SaveDialogForm } from '@/models/SaveDialogForm';

@Module({ generateMutationSetters: true })
class RecordStoreModule extends VuexModule {
  public loading: boolean = false;
  public recording: IAction[] = [];
  public error: string = "";

  @Mutation
  public SetRecording(recording: IAction[]) {
    this.recording = recording;
  }

  @Action
  public async Save(args: { auth: Auth, formData: SaveDialogForm }) {
    this.loading = true;
    console.log('Saving recording...');
    let log = JSON.stringify(this.recording);
    let storageSpace = (encodeURI(log).split(/%..|./).length - 1) / 1000000;
    console.log(`Storing ${String(storageSpace)} MB`);
    if (storageSpace > 2000000) {
      let error = 'Recording too large (yes you got a problem now)';
      this.error = error;
      console.warn(error);
      return;
    }
    args.auth
      .query(
        process.env.VUE_APP_URL + '/api/create',
        {
          scopes: [
            process.env.VUE_APP_SCOPE_WRITE,
            process.env.VUE_APP_SCOPE_READ
          ]
        },
        'POST',
        {
          Recording: log,
          Title: args.formData.title,
          Description: args.formData.description
        }
      )
      .then(res => {
        console.log(res);
        this.loading = false;
      });
  }
}

import store from './store';
export const RecordStore = new RecordStoreModule({ store, name: "RecordStore" });