import adapter from '@sveltejs/adapter-static';
export default { kit: { paths: { base: process.env.BASE_PATH || '' }, adapter: adapter({ fallback: '200.html' }) } };
