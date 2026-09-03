import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface GoogleUserInfo {
  email: string | null;
  name: string | null;
  picture: string | null;
}

@Injectable()
export class GoogleAuthService {
  async verifyAccessToken(accessToken: string): Promise<GoogleUserInfo> {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(accessToken)}`,
    );

    if (!res.ok) {
      throw new UnauthorizedException('Invalid Google access token');
    }

    const payload = (await res.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };

    return {
      email: payload.email ?? null,
      name: payload.name ?? null,
      picture: payload.picture ?? null,
    };
  }
}
