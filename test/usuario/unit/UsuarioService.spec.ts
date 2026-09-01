import { beforeEach, describe, it, expect, jest, } from '@jest/globals';
import { UsuarioService } from '../../../src/services/UsuarioService';
import {mockUsuarioClient} from '../mocks/usuarioService.mock';
import {usuarioModelo} from '../../models/usuario.modelo';
import {CoreResponseBad, CoreResponseOk} from '../../models/core.response';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  beforeEach(() => {
    jest.clearAllMocks();
    usuarioService = new UsuarioService(mockUsuarioClient);
  });
    it("Obtener respuesta de obtenerUsuario", async () => {
        mockUsuarioClient.obtenerUsuario.mockResolvedValue(CoreResponseOk(usuarioModelo));


        const result = await usuarioService.obtenerUsuario(expect.any(Object), '1');
        expect(result.data).toEqual(usuarioModelo);
        expect(mockUsuarioClient.obtenerUsuario).toHaveBeenCalledWith(expect.any(Object), '1');
    });

    it("Sale mal y lanza error obtenerUsuario", async () => {
    mockUsuarioClient.obtenerUsuario.mockRejectedValue( new Error('Error interno inesperado en el BFF') );

    const result = usuarioService.obtenerUsuario({}, '1');
    await expect(result).rejects.toThrow('Error interno inesperado en el BFF');
    expect(mockUsuarioClient.obtenerUsuario).toHaveBeenCalledWith({}, '1');
});
    it("Sale mal y lanza error backend", async () => {
        mockUsuarioClient.obtenerUsuario.mockRejectedValue(CoreResponseBad());
        const result = await usuarioService.obtenerUsuario(expect.any(Object), '1');
        expect(result).toEqual(CoreResponseBad());
        expect(mockUsuarioClient.obtenerUsuario).toHaveBeenCalledWith(expect.any(Object), '1');
    });

});
