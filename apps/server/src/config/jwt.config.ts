import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret:
      process.env.JWT_ACCESS_SECRET ||
      'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
    global: true,
    signOptions: { expiresIn: '15m' },
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
    refreshSignOptions: { expiresIn: '7d' },
    // signOptions: { expiresIn: '60s' },
    // issuer: process.env.JWT_TOKEN_ISSUER,
    // accessTokenTtl: parseInt(process.env.JWT_TOKEN_TTL),
  };
});

/**
 * Source: https://stackoverflow.com/a/74903830
 */
