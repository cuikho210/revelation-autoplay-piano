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

        page_title_home: string
        page_title_addmusic: string
        page_title_list_music: string
        page_title_setting: string
        page_title_404: string

        music_delete_file_confirm: string
        music_rename_input_placeholder: string
        music_context_menu_open: string
        music_context_menu_edit: string
        music_context_menu_rename: string
        music_context_menu_remove: string
        music_searchbar_placeholder: string
        music_create_collection_button: string
        music_create_collection_placeholder: string
        music_import_midi_file_button: string

        setting_key_assignment_title: string
        setting_key_assignment_help: string
        setting_key_assignment_button_create_profile: string

        home_description: string
        home_guide_title: string
        home_guide_step_1: string
        home_guide_step_2: string
        home_guide_step_3: string
        home_info_title: string
        home_info_author: string
    }

    interface Locale {
        key: string
        name: string
        is_current_locale: boolean
        message: Message
    }
}