// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import "dotenv/config";

// @Injectable()
// export class AuthClient {
  
//   async makePostRequest(endpoint: string, body: any, forwardedHeaders: any) {
//     const targetUrl = `${process.env.coreBaseUrl}/${endpoint}`;

//     try {
//       const response = await fetch(targetUrl, {
//         method: 'POST',
//         headers: {
//           ...forwardedHeaders,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await response.json();
      
//       // Extraemos la cookie directamente acá para dársela al Service
//       const setCookieHeader = response.headers.getSetCookie();

//       return {
//         status: response.status,
//         data,
//         cookies: setCookieHeader,
//       };
//     } catch (error) {
//       console.error(`Error en AuthClient hacia /${endpoint}:`, error);
//       throw new HttpException('Error de conexión con el Core', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }