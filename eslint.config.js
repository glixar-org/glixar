// eslint.config.js

// Importamos las herramientas necesarias
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    // Configuración global de archivos a ignorar
    {
        ignores: ['dist/', 'node_modules/'],
    },

    // Configuración para nuestros archivos TypeScript
    ...tseslint.config({
        files: ['src/**/*.ts'],
        extends: [
            // Usamos las reglas recomendadas de typescript-eslint
            ...tseslint.configs.recommended,
        ],
        languageOptions: {
            // Definimos los entornos globales (navegador, node)
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    }),

    // La configuración de Prettier SIEMPRE debe ir al final.
    // Esto desactiva cualquier regla de estilo de ESLint que entre en conflicto con Prettier.
    eslintConfigPrettier,
];
