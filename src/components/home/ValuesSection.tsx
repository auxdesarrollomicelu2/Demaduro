import Card from '../ui/Card'
import PatternOverlay from '../ui/PatternOverlay'

export default function ValuesSection() {
  const values = [
    {
      icon: '🍌',
      title: 'Plátano de verdad',
      description: 'Viene muy maduro y en su punto, gratinado con queso que se disfruta. ¡Protagonista de casa hecha!',
    },
    {
      icon: '👵',
      title: 'Receta de la abuela',
      description: 'Es la receta de casa de la abuela, ovaladito y ese cariño que solo esta en domingo por la tarde y en familia.',
    },
    {
      icon: '❤️',
      title: 'Una experiencia rica',
      description: 'Una experiencia con casa Demaduro es para momento rico, casualeros y para compartir.',
    },
  ]

  return (
    <section className="relative overflow-hidden py-12 px-4 sm:py-16 sm:px-6 lg:px-8 bg-accent">
      <PatternOverlay className="bg-white opacity-80" tileWidth={400} />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-primary font-bold text-sm uppercase tracking-wide mb-2">
            NUESTRA ESENCIA
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark">
            Aquí huele a la hora del algo
          </h2>
          <p className="text-dark-light mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            No es solo plátano maduro, fría o papitas de la abuelita, es el domingo por la tarde y el sabor de casa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {values.map((value, index) => (
            <Card key={index} variant="elevated" className="text-center">
              <div className="space-y-4">
                <div className="text-5xl">{value.icon}</div>
                <h3 className="text-xl font-bold text-dark">{value.title}</h3>
                <p className="text-dark-light leading-relaxed">{value.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
