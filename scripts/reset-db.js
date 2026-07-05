const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categoriesWithSubsections = {
  Dama: ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias', 'Zapatos'],
  Caballero: ['Pantalones', 'Pantalonetas', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Zapatos', 'Ropa interior', 'Ropa deportiva'],
  Niño: ['Pantalones', 'Zapatos', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Ropa interior'],
  Niña: ['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Zapatos', 'Vestidos', 'Ropa interior', 'Medias'],
  Accesorios: ['Gafas', 'Relojería', 'Joyería', 'Tecnología'],
  Edredones: ['Sábanas', 'Almohadas', 'Cobijas', 'Cubrelechos', 'Fundas'],
  Esika: [],
};

async function resetCategories() {
  try {
    console.log('Eliminando subsecciones...');
    const { error: deleteSubError } = await supabase
      .from('subsections')
      .delete()
      .not('id', 'is', null);

    if (deleteSubError) {
      console.error('Error eliminando subsecciones:', deleteSubError);
      return;
    }

    console.log('Subsecciones eliminadas');

    console.log('Eliminando secciones...');
    const { error: delSectError } = await supabase
      .from('sections')
      .delete()
      .not('id', 'is', null);

    if (delSectError) {
      console.error('Error eliminando secciones:', delSectError);
      return;
    }

    console.log('Secciones eliminadas');

    for (const [categoryName, subsections] of Object.entries(categoriesWithSubsections)) {
      const slug = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-');

      const { data: newSection, error: sectionError } = await supabase
        .from('sections')
        .insert({
          name: categoryName,
          slug,
          description: `Catálogo de ${categoryName.toLowerCase()}`,
          order: Object.keys(categoriesWithSubsections).indexOf(categoryName),
          is_active: true,
        })
        .select()
        .single();

      if (sectionError) {
        console.error(`Error creando sección "${categoryName}":`, sectionError);
        continue;
      }

      const sectionId = newSection.id;
      console.log(`Sección "${categoryName}" creada`);

      if (subsections.length > 0) {
        for (const subsectionName of subsections) {
          const subsectionSlug = subsectionName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-');

          const { error: subsectionError } = await supabase
            .from('subsections')
            .insert({
              section_id: sectionId,
              name: subsectionName,
              slug: subsectionSlug,
              description: `${subsectionName} de ${categoryName}`,
              order: subsections.indexOf(subsectionName),
              is_active: true,
            });

          if (subsectionError) {
            console.error(`Error creando subsección "${subsectionName}":`, subsectionError);
          } else {
            console.log(`  ✓ Subsección "${subsectionName}"`);
          }
        }
      }
    }

    console.log('\n✅ Categorías y subsecciones actualizadas correctamente');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetCategories();
