import { Injectable, NestMiddleware } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as serviceAccount from '../../database/firebaseAccount.json';

const firebaseConfig = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientX509CertUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class FirebaseService implements NestMiddleware {
  firebaseApp: any;

  constructor() {
    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig),
      databaseURL: process.env.FIREBASE_DB,
    });
  }

  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.firebaseApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          const user = {
            email: decodedToken.email,
          };
          req['user'] = user;
          next();
        })
        .catch((error) => {
          console.log(error);
          this.accessDenied(req.url, res);
        });
    } else {
      next();
    }
  }

  private accessDenied(url: string, res: any) {
    res.status(403).json({
      status: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
