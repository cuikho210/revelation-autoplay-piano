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

    interface Note {
        key: keyof Octaves
        octa: number
        position: Position
    }

    type Piano84Key = Note[]
}

namespace Music {
    type Beat = string[]

    interface Music {
        tempo: number
        data: Beat[]
    }
}

namespace Locale {
    interface Message {
        sidebar_button_home: string
        sidebar_button_add_music: string
        sidebar_button_list_music: string
        sidebar_button_setting: string


    }

    interface Locale {
        key: string
        name: string
        is_current_locale: boolean
        message: Message
    }
}