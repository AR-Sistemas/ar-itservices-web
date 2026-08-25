# Integrar React Bits como registro de componentes

## Qué se puede hacer (y qué no)

El servidor MCP de shadcn que describe la doc de React Bits corre en tu editor local (VS Code, Cursor). Yo no ejecuto ese MCP desde acá, así que un `.vscode/mcp.json` no cambia nada en cómo trabajo en Lovable.

Lo que sí sirve, y es la parte que realmente importa: dejar configurado el **registro `@react-bits`** en el proyecto. Con eso, cada vez que pidas un componente de React Bits, lo instalo directo desde el registro oficial (código real, actualizado) en vez de reescribirlo a mano como venimos haciendo con `AnimatedContent`, `BlurText`, `MagicBento`, etc.

## Cambios

1. **`components.json`**: agregar la entrada de registro.
   ```json
   "registries": {
     "@react-bits": "https://reactbits.dev/r/{name}.json"
   }
   ```

2. **`.vscode/mcp.json`**: generarlo con la config del servidor MCP de shadcn, para que si abrís el repo en VS Code / Cursor tengas el MCP disponible localmente. (Opcional, no afecta al sitio.)

3. **Validación**: instalar un componente de prueba desde el registro (`bunx shadcn@latest add @react-bits/<nombre>`) para confirmar que la resolución funciona, revisar dónde cae el archivo y que compile.

## Consideraciones

- Los componentes de React Bits vienen con colores y estilos por defecto. Se mantiene la regla vigente: todo lo que entre por el registro se restylea a la paleta AR (`#FF000D`, `#990F1B`, fondo `#14131C`, tarjetas `#232234`) y respeta `prefers-reduced-motion`.
- Los componentes que ya escribimos a mano quedan como están; no los reemplazo por las versiones del registro salvo que lo pidas.
- Nada de dependencias pesadas (Three.js / WebGL) sin avisarte antes, igual que hasta ahora.
