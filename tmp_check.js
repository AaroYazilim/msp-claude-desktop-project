const fs = require('fs');
const doc = JSON.parse(fs.readFileSync('not.json', 'utf8'));

const cariPost = doc.paths['/api/Cari']['post'];
const bodyParam = cariPost.parameters.find(p => p.in === 'body');

if (bodyParam && bodyParam.schema && bodyParam.schema['$ref']) {
  const refKey = bodyParam.schema['$ref'].replace('#/definitions/', '');
  const def = doc.definitions[refKey];

  console.log('=== Definition:', refKey, '===');
  console.log('\nRequired fields:', JSON.stringify(def.required, null, 2));
  console.log('\n=== All Properties ===');
  for (const [name, schema] of Object.entries(def.properties)) {
    console.log(`  ${name}: type=${schema.type ?? schema['$ref'] ?? 'object'}, format=${schema.format ?? '-'}, enum=${schema.enum ?? '-'}`);
  }
}
