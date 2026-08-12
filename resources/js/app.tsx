import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const pages = import.meta.glob('./Pages/**/*.tsx');

createInertiaApp({
    title: (title) => `${title} - Abu Hurairah`,

    resolve: async (name) => {
        const page = pages[`./Pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page "${name}" tidak ditemukan.`);
        }

        const module = await page();

        return (module as { default: React.ComponentType }).default;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});