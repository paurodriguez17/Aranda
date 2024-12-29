{
    "version"; 2,
    "builds";[
      {
        "src": "/inicio/inicio.js", // Cambia "index.js" al nombre de tu archivo principal de servidor
        "use": "@vercel/node"
      }
    ],
    "routes"; [
      {
        "src": "/(.*)",
        "dest": "/inicio/inicio.js" // Cambia al nombre de tu archivo principal
      }
    ]
  }
