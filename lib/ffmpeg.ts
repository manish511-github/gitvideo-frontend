import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ 
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
});

let isLoaded = false;

export const initFFmpeg = async () => {
  if (!isLoaded) {
    await ffmpeg.load();
    isLoaded = true;
  }
};

export const cutVideo = async (
    file : File,
    startTime: number,
    endTime :number
): Promise<Blob> =>{
    await initFFmpeg();
    //upload a file into ffmpeg’s memory,
    ffmpeg.FS('writeFile' , 'input.mp4', await fetchFile(file));
    await ffmpeg.run(
        '-i', 'input.mp4',
        '-ss', startTime.toString(),
        'to', endTime.toString(),
        '-c', 'copy',
        'output.mp4'
    );
    //This line reads the binary data of output.mp4 (the cut or processed video) out of FFmpeg’s memory, and saves it into the variable data.
    const data = ffmpeg.FS('readFile','output.mp4');
    //You are reading the output.mp4 out from that virtual /MEMFS folder.
    return new Blob([new Uint8Array(data.buffer)], { type: 'video/mp4' });
 
}