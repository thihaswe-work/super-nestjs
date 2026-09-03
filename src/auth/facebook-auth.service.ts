import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface FacebookUserInfo {
  email: string | null;
  name: string | null;
  picture: string | null;
  facebookId: string;
}

@Injectable()
export class FacebookAuthService {
  async verifyAccessToken(accessToken: string): Promise<FacebookUserInfo> {
    const res = await fetch(
      `https://graph.facebook.com/me?access_token=${encodeURIComponent(accessToken)}&fields=id,name,email,picture`,
    );

    if (!res.ok) {
      throw new UnauthorizedException('Invalid Facebook access token');
    }

    const payload = (await res.json()) as {
      id?: string;
      name?: string;
      email?: string;
      picture?: { data?: { url?: string } };
    };

    if (!payload.id) {
      throw new UnauthorizedException('Invalid Facebook access token');
    }

    return {
      email: payload.email ?? null,
      name: payload.name ?? null,
      picture: payload.picture?.data?.url ?? null,
      facebookId: payload.id,
    };
  }
}
