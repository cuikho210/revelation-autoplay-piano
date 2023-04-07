use std::{thread, path::PathBuf, fs::File};
use std::io::BufReader;
use rodio::{Decoder, OutputStream, Sink};

pub fn play(note_path: PathBuf) {
    thread::spawn(move || {
        let (_stream, stream_handler) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handler).unwrap();

        let file = BufReader::new(File::open(note_path).unwrap());
        let source = Decoder::new(file).unwrap();

        sink.append(source);
        sink.sleep_until_end();
    });
}