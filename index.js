// index.js

// 1. Usamos destructuring y el operador 'rest' (...) para capturar los comandos.
// process.argv[0] es la ruta a Node, process.argv[1] es la ruta al archivo.
// Nos interesan los argumentos a partir de la posición 2.
const [, , method, route, ...productData] = process.argv;

// URL base de la API FakeStore
const API_URL = 'https://fakestoreapi.com';

// Función principal asíncrona
const manageProducts = async () => {
  // Validación de seguridad por si el usuario no envía argumentos
  if (!method || !route) {
    console.error("❌ Error: Faltan argumentos. Ej: npm run start GET products");
    return;
  }

  // 2. Método de string (split) y destructuring de array para separar la ruta del ID.
  // Si entra "products/15", resource="products" y id="15".
  // Si entra "products", resource="products" y id=undefined.
  const [resource, id] = route.split('/');

  if (resource !== 'products') {
    console.error("❌ Recurso no válido. Debes usar 'products'.");
    return;
  }

  try {
    // Usamos toUpperCase() (método de string) para asegurar que el método HTTP siempre se lea en mayúsculas
    switch (method.toUpperCase()) {
      
      // ---------------------------------------------------------
      // CONSULTAR PRODUCTOS (Todos o Específico)
      // ---------------------------------------------------------
      case 'GET': {
        // Operador ternario: si hay ID, formamos la ruta al producto, si no, traemos todos.
        const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`\n📦 --- Resultado GET (${id ? `Producto ${id}` : 'Todos los productos'}) ---`);
        console.log(data);
        break;
      }

      // ---------------------------------------------------------
      // CREAR UN PRODUCTO NUEVO
      // ---------------------------------------------------------
      case 'POST': {
        // Destructuring del resto de los argumentos
        const [title, price, category] = productData;

        if (!title || !price || !category) {
          console.error("❌ Error: Faltan datos. Ej: npm run start POST products T-Shirt-Rex 300 remeras");
          return;
        }

        const newProduct = { 
          title, 
          price: Number(price), // Convertimos el precio a número
          category 
        };

        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          body: JSON.stringify(newProduct),
          headers: { 'Content-Type': 'application/json' } // FakeStore requiere enviar JSON
        });
        
        const data = await response.json();
        
        console.log('\n✅ --- Producto Creado Exitosamente ---');
        // 3. Uso del operador spread (...) para combinar la respuesta de la API con una propiedad extra
        const finalOutput = { ...data, operationStatus: "Success" };
        console.log(finalOutput);
        break;
      }

      // ---------------------------------------------------------
      // ELIMINAR UN PRODUCTO
      // ---------------------------------------------------------
      case 'DELETE': {
        if (!id) {
          console.error("❌ Error: Falta el ID del producto a eliminar. Ej: npm run start DELETE products/7");
          return;
        }

        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        console.log(`\n🗑️ --- Producto ${id} Eliminado ---`);
        console.log(data);
        break;
      }

      default:
        console.error(`❌ Método HTTP '${method}' no soportado por esta herramienta.`);
    }

  } catch (error) {
    console.error("❌ Ocurrió un error al comunicarse con la API:", error.message);
  }
};

// Ejecutamos la función
manageProducts();