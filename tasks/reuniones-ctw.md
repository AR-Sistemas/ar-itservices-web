# Registro de reuniones CTW

La ruta `/reuniones` permite cargar datos en la pestaña `Reuniones` de una planilla. El servidor únicamente solicita a Sheets agregar una fila; la cuenta de servicio igualmente tiene permisos de edición sobre el archivo completo.

## Configuración del servidor

- `REUNIONES_CLAVE`: clave compartida de al menos 16 caracteres, mantenida como secreto. Cada envío valida en el servidor una sesión vinculada a esta clave.
- `REUNIONES_SESSION_SECRET`: secreto aleatorio independiente de al menos 32 caracteres para firmar la sesión; nunca compartirlo con el equipo ni incluirlo en el navegador o el repositorio.
- `GOOGLE_SERVICE_ACCOUNT_JSON`: JSON de la cuenta de servicio, como secreto del servidor.
- `REUNIONES_SHEET_ID`: ID de la planilla del entorno correspondiente.

No usar prefijo `VITE_` ni cargar valores reales en el repositorio. Configurar entornos por separado y usar una planilla de pruebas para Preview. El orden esperado de las columnas es Nombre, Teléfono, Lunes, Martes, Miércoles, Jueves, Viernes, Descripción, Semana.

La sesión usa una cookie HttpOnly de sesión del navegador, con vencimiento máximo de 12 horas y comprobación en cada envío. Rotar la clave o el secreto invalida sesiones existentes. Ante un resultado incierto se pide capturar los datos y avisar al equipo; esta versión no mantiene una cola ni reintenta la escritura automáticamente.

## Antes de habilitar el uso

- En Vercel se configuró una regla para limitar conjuntamente a 10 solicitudes por minuto por IP las funciones de acceso y guardado. Comprobar que los identificadores de función de cada despliegue coincidan con los de la regla y verificar el límite. Usuarios que compartan IP también comparten el cupo.
- Configurar los secretos y el ID del entorno, comprobar la compilación y probar en Preview con datos ficticios. Confirmar el rechazo de clave incorrecta y entradas inválidas, así como la fila creada y sus columnas.
- Verificar Production con una prueba acordada, comprobar la planilla y compartir la clave por un canal seguro. Un error de conexión puede producir un resultado incierto: verificar la planilla antes de reintentar para evitar duplicados.
- No interpretar `noindex` como protección. La clave compartida no identifica individualmente a quien carga ni permite revocar el acceso de una sola persona.

## Prueba local del 12/11/2026

Con una clave ficticia y la cuenta técnica configurada en el proceso local se agregó y verificó una fila ficticia en la planilla acordada (fila 2). Se verificaron las columnas y las franjas seleccionadas. La prueba no verifica el secreto cargado en Vercel ni sustituye las pruebas en Preview o Production. La fila de prueba permanece identificada como tal.
