use std::thread;
use std::fs::File;
use std::io::BufReader;
use rodio::{Decoder, OutputStream, Sink};

pub fn play(note: String) {
    thread::spawn(move || {
        let (_stream, stream_handler) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handler).unwrap();

        let file_src = format!("../public/piano_key/{}.mp3", note);
        let file = BufReader::new(File::open(file_src).unwrap());
        let source = Decoder::new(file).unwrap();

        sink.append(source);
        sink.sleep_until_end();
    });
}