import { Injectable, UnauthorizedException } from '@nestjs/common';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

export interface FirebaseUserInfo {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
}

@Injectable()
export class FirebaseAuthService {
  private auth: Auth | null = null;

  private authInstance(): Auth {
    if (this.auth) {
      return this.auth;
    }

    const existing = getApps()[0];
    const app = existing ?? this.initApp();
    this.auth = getAuth(app);
    return this.auth;
  }

  private initApp() {
    const serviceAccount = process.env['FIREBASE_SERVICE_ACCOUNT'];
    const projectId = process.env['FIREBASE_PROJECT_ID'];

    if (!serviceAccount || !projectId) {
      throw new Error(
        'FirebaseAuthService requires FIREBASE_SERVICE_ACCOUNT (JSON) and FIREBASE_PROJECT_ID env vars',
      );
    }

    return initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      projectId,
    });
  }

  async verifyIdToken(idToken: string): Promise<FirebaseUserInfo> {
    let decoded;
    try {
      decoded = await this.authInstance().verifyIdToken(idToken);
    } catch (error) {
      const isConfigError =
        process.env['FIREBASE_SERVICE_ACCOUNT'] === undefined ||
        process.env['FIREBASE_PROJECT_ID'] === undefined;
      if (isConfigError) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Firebase ID token');
    }

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      picture: decoded.picture ?? null,
    };
  }
}
