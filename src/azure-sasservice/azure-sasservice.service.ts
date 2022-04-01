import {
  AccountSASPermissions,
  AccountSASResourceTypes,
  AccountSASServices,
  generateAccountSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AzureSASServiceService {
  private credential: StorageSharedKeyCredential;
  constructor() {
    this.credential = new StorageSharedKeyCredential(
      'a360scrapreadydev',
      'AVLRr/lH1QZ9wB6C2ZHBhjb4hWusts3242knrTAs31FUBpGAJZC8Elq3Wo7SGOkVmvbgF2i879LQ+ASttmtupA==',
    );
  }
  getNewSASKey() {
    //We should probably add a config object here
    let expiryTime = new Date();
    let startTime = new Date();
    expiryTime.setMinutes(new Date().getMinutes() + 1);

    return (
      '?' +
      generateAccountSASQueryParameters(
        {
          services: AccountSASServices.parse('b').toString(),
          resourceTypes: AccountSASResourceTypes.parse('sco').toString(),
          permissions: AccountSASPermissions.parse('r'),
          ipRange: { start: '0.0.0.0', end: '255.255.255.255' },
          protocol: SASProtocol.HttpsAndHttp,
          startsOn: startTime,
          expiresOn: expiryTime,
        },
        this.credential,
      ).toString()
    );
  }
}
