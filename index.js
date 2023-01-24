const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const client = new Client({})

client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('Sticker Bot Started!!!')
});

client.on('message_create', msg => {
    const command = msg.body.split(' ')[0];
    const sender = msg.from.includes("num_cellphone") ? msg.to : msg.from
    if (command === "/sticker")  generateSticker(msg, sender)
});

client.initialize();

const generateSticker = async (msg, sender) => {
    if(msg.type === "image") {
        try {
            const { data } = await msg.downloadMedia()
            const image = await new MessageMedia("image/jpeg", data, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true })
        } catch(e) {
            msg.reply("❌ Erro ao processar imagem")
        }
    } else {
        try {

            const url = msg.body.substring(msg.body.indexOf(" ")).trim()
            const { data } = await axios.get(url, {responseType: 'arraybuffer'})
            const returnedB64 = Buffer.from(data).toString('base64');
            const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true })
        } catch(e) {
            msg.reply("❌ Não foi possível gerar um sticker com esse link")
        }
    }
}