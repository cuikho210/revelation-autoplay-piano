interface Position {
    x: number
    y: number
}

namespace Piano {
    interface Octaves {
        "C": Position
        "C#": Position
        "D": Position
        "D#": Position
        "E": Position
        "F": Position
        "F#": Position
        "G": Position
        "G#": Position
        "A": Position
        "A#": Position
        "B": Position
    }

    interface Piano24Key {
        "octa1": Octaves
        "octa2": Octaves
    }
}