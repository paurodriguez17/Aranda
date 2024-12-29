{
    "version"; 2,
    "builds";[
      {
        "src": "public/inicio/inicio.js", // Cambia "index.js" al nombre de tu archivo principal de servidor
        "use": "@vercel/node"
      }
    ],
    "routes"; [
      {
        "src": "/(.*)",
        "dest": "public/inicio/inicio.js" // Cambia al nombre de tu archivo principal
      }
    ]
  }
