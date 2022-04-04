import { ServiceAccount } from 'firebase-admin';

const service: ServiceAccount = {
  projectId: 'scrapready-711d9',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDVWUQLKSFzDYXz\ne77lbZyD4DXEMaXcqnHgPrkzuHh8lEP7gzU4XeYRhmuM1hCJhWPBJIWB099SCHrL\n282CzThXFuwQ+a5tlzDPvp67OzMqETgfSKzhYSobBWlvHaQ1nTH44P0MLAeEWiHb\nhKXafvXWRZP+Xvl2qSgEfCXhe1JHS5h9ecwKjL/jdssFD+pRn6KGaLSoZXLhOcEA\nGuzZrljMr/68BVxqRwhveMmRy/HRuRTQ325PEpHRJXY/yZ/EtRANAf0I2S2OJVjc\nubwouUgZ8Ly5Ur3gZt6VGM2X+TUlG1Ygn63dH/1uvWLbUNkZhVvlN0YDTvtsFvwZ\niLueHF57AgMBAAECggEAIJOAQG9X1FWoxzb1EjAXRCBR5V1VVOkmToC/+Ps+U9C0\nbqzSoq2Hvyj2DBZK28y6dhfUVjCv5TqL5svESKglkFAHh0dbOxA+W5eLbM2gcC3F\nPYBJ0Xdrcp50F7YqyCWdUeynXBqZopERTA+oNBbLBRww+ZgD4aVONHJxEEmrFF0u\n1DTyoH30Z4gzLlrRr9WjgANHdAxyyM0g0ECDD2arVvuLWtux7385Vr64F2pz09a7\n+dQ0SsM+vqelsUG6Etu2j/mAq7XvykUevyFtoRkrVC/xRdNKn7UIzmAoCfJBYAXp\nILWJltUWe2fv06DOxaRfw6X8Ez4+Em6/JvamAR2wjQKBgQD93jQHIGw/HF9uDht8\nvtRl3Joasvyup/AQCsPceMW0W8OP/XyPaEacXQZGqApfOOttQuRqiqUWfcwAGoFf\nXKw/SWH2Qb7Io16MIRGbr1qsIvewn6HJvG/qOxR8+ck7HrikRHxXukc+2rNIMEQp\nprzh3GWNFoHbhDGq4biL03ntxwKBgQDXI/L+IIwjzpE1DN7YBcmamkrpeCApz1Gb\nKS3TU/4Dv8jeV4vhWGPFlPJPC50NOCAbgXl+8H8yi76fegWqJTFZR8y+yY9/h8mM\np7tliaZDctloL7HfJmqiUKeUmdBVG8/l/nhFdat317/8VHQcB8fOMASgOCEgE4Bl\ndPpEOI/ZrQKBgDZX85E2+pUD8NWxRWcNvo/TilV+zSJiJrx4YXb3j3LNVe6j158n\nNj5Ql4BWhmnd2F+6OwUnirFm2l2HTvxn7SNbBRJe/oUam6mphohqICHLFnSDp3F0\n2gws+3TJT69NIz9evbNV19x3mnswgdbcr4A12rM6BzBDexJWYVflPCuPAoGAMR6Z\nFSJzPJ2mE5mrq2Cu5eiCYAm4NjOKa0Wcm9pabZq1DuaoHjwjE3JtXFTHd8QvuHf4\nOF5KfEzhqeGfN3ikasD04z57z989yiplo8oots+bCamSD+PihsqpaEkyAqyF6/oM\nlbdG/ea5g6/4jonMOaxG8hm+nmc1cnShyz+qwEUCgYEAhIzSUkYxo2gxyEgE/iEL\nPFqzY4INcPtdlPNaVN1ZyTltolsMTiKgB5je0diUk2en45Xuw42evHbBvyHMtjaR\nop6vXLXXqGRi4vCKEgUxt+njCcuAYgmWrnJ0qxedR1Fc33W1w3BQLFANVdgLlDCH\nmfMta85N36zgyswVdwthWCs=\n-----END PRIVATE KEY-----\n',
  clientEmail:
    'firebase-adminsdk-r3g58@scrapready-711d9.iam.gserviceaccount.com',
};

export default service;

// {
//   type: 'service_account',
//   project_id: 'scrapready-711d9',
//   private_key_id: 'dd75a381980202806155ced3d931bff80f50725f',
//   private_key:
//     '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDVWUQLKSFzDYXz\ne77lbZyD4DXEMaXcqnHgPrkzuHh8lEP7gzU4XeYRhmuM1hCJhWPBJIWB099SCHrL\n282CzThXFuwQ+a5tlzDPvp67OzMqETgfSKzhYSobBWlvHaQ1nTH44P0MLAeEWiHb\nhKXafvXWRZP+Xvl2qSgEfCXhe1JHS5h9ecwKjL/jdssFD+pRn6KGaLSoZXLhOcEA\nGuzZrljMr/68BVxqRwhveMmRy/HRuRTQ325PEpHRJXY/yZ/EtRANAf0I2S2OJVjc\nubwouUgZ8Ly5Ur3gZt6VGM2X+TUlG1Ygn63dH/1uvWLbUNkZhVvlN0YDTvtsFvwZ\niLueHF57AgMBAAECggEAIJOAQG9X1FWoxzb1EjAXRCBR5V1VVOkmToC/+Ps+U9C0\nbqzSoq2Hvyj2DBZK28y6dhfUVjCv5TqL5svESKglkFAHh0dbOxA+W5eLbM2gcC3F\nPYBJ0Xdrcp50F7YqyCWdUeynXBqZopERTA+oNBbLBRww+ZgD4aVONHJxEEmrFF0u\n1DTyoH30Z4gzLlrRr9WjgANHdAxyyM0g0ECDD2arVvuLWtux7385Vr64F2pz09a7\n+dQ0SsM+vqelsUG6Etu2j/mAq7XvykUevyFtoRkrVC/xRdNKn7UIzmAoCfJBYAXp\nILWJltUWe2fv06DOxaRfw6X8Ez4+Em6/JvamAR2wjQKBgQD93jQHIGw/HF9uDht8\nvtRl3Joasvyup/AQCsPceMW0W8OP/XyPaEacXQZGqApfOOttQuRqiqUWfcwAGoFf\nXKw/SWH2Qb7Io16MIRGbr1qsIvewn6HJvG/qOxR8+ck7HrikRHxXukc+2rNIMEQp\nprzh3GWNFoHbhDGq4biL03ntxwKBgQDXI/L+IIwjzpE1DN7YBcmamkrpeCApz1Gb\nKS3TU/4Dv8jeV4vhWGPFlPJPC50NOCAbgXl+8H8yi76fegWqJTFZR8y+yY9/h8mM\np7tliaZDctloL7HfJmqiUKeUmdBVG8/l/nhFdat317/8VHQcB8fOMASgOCEgE4Bl\ndPpEOI/ZrQKBgDZX85E2+pUD8NWxRWcNvo/TilV+zSJiJrx4YXb3j3LNVe6j158n\nNj5Ql4BWhmnd2F+6OwUnirFm2l2HTvxn7SNbBRJe/oUam6mphohqICHLFnSDp3F0\n2gws+3TJT69NIz9evbNV19x3mnswgdbcr4A12rM6BzBDexJWYVflPCuPAoGAMR6Z\nFSJzPJ2mE5mrq2Cu5eiCYAm4NjOKa0Wcm9pabZq1DuaoHjwjE3JtXFTHd8QvuHf4\nOF5KfEzhqeGfN3ikasD04z57z989yiplo8oots+bCamSD+PihsqpaEkyAqyF6/oM\nlbdG/ea5g6/4jonMOaxG8hm+nmc1cnShyz+qwEUCgYEAhIzSUkYxo2gxyEgE/iEL\nPFqzY4INcPtdlPNaVN1ZyTltolsMTiKgB5je0diUk2en45Xuw42evHbBvyHMtjaR\nop6vXLXXqGRi4vCKEgUxt+njCcuAYgmWrnJ0qxedR1Fc33W1w3BQLFANVdgLlDCH\nmfMta85N36zgyswVdwthWCs=\n-----END PRIVATE KEY-----\n',
//   client_email:
//     'firebase-adminsdk-r3g58@scrapready-711d9.iam.gserviceaccount.com',
//   client_id: '105919120536493438222',
//   auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//   token_uri: 'https://oauth2.googleapis.com/token',
//   auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//   client_x509_cert_url:
//     'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r3g58%40scrapready-711d9.iam.gserviceaccount.com',
// }
