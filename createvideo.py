from moviepy.editor import *
from gtts import gTTS
import sys

audiolocation = "assets/audio.mp3"
videolocation = "assets/template.mp4"
finalvideo = "assets/video.mp4"

def createVideo(): 
    audioclip = AudioFileClip(audiolocation)
    videoclip = VideoFileClip(videolocation).subclip(0, audioclip.duration)
    videoclip.audio = audioclip
    videoclip.write_videofile(finalvideo)

def createAudio(text):
    mytext = text
    language = 'en'
    myobj = gTTS(text=mytext, lang=language, slow=False)
    myobj.save(audiolocation)
    createVideo()

if __name__ == "__main__":
    message = str(sys.argv[1])
    createAudio(message)