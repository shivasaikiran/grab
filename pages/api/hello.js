import cookie from 'cookie';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', cookie.serialize('username', 'JohnDoe', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
    path: '/',
  }));
  res.status(200).json({ success: true });
}
