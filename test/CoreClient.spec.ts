import { CoreClient } from '../src/client/CoreClient';


describe('CoreClient login', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe devolver las cookies de sesión cuando la respuesta usa set-cookie', async () => {
    const headers = {
      get: jest.fn((name: string) => (name === 'set-cookie' ? 'session=abc; Path=/; HttpOnly' : null)),
      getSetCookie: undefined,
    };

    const response = {
      status: 200,
      headers,
      json: jest.fn().mockResolvedValue({ ok: true, user: { id: '1' } }),
    } as unknown as Response;

    global.fetch = jest.fn().mockResolvedValue(response);

    const client = new CoreClient();
    const result = await client.iniciarSesion({ email: 'test@test.com', password: '123456' }, {});

    expect(result.status).toBe(200);
    expect(result.cookies).toEqual(['session=abc; Path=/; HttpOnly']);
  });
});
