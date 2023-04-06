interface Position {
    x: number
    y: number
}

namespace Piano {
    interface Octaves {
        "C": Position
        "Db": Position
        "D": Position
        "Eb": Position
        "E": Position
        "F": Position
        "Gb": Position
        "G": Position
        "Ab": Position
        "A": Position
        "Bb": Position
        "B": Position
    }

    interface Piano24Key {
        "octa1": Octaves
        "octa2": Octaves
    }
}