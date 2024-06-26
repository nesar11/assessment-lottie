const { GraphQLUpload } = require('graphql-upload');
const path = require('path');
const fs = require('fs');

const animations = []; 

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    animations: () => animations,
    animation: (parent, { id }) => animations.find((anim) => anim.id === id),
    files: () => {
      const uploadsDir = path.join(__dirname, '../uploads');
      const filesList = fs.readdirSync(uploadsDir).map((filename) => {
        const filePath = path.join(uploadsDir, filename);
        const fileStats = fs.statSync(filePath);
        return {
          filename,
          mimetype: 'application/octet-stream', 
          encoding: '7bit', 
          url: `/uploads/${filename}`,
        };
      });
      return filesList;
    },
    searchFiles: (parent, { filename }) => {
      const uploadsDir = path.join(__dirname, '../uploads');
      const filesList = fs.readdirSync(uploadsDir).filter((file) =>
        file.toLowerCase().includes(filename.toLowerCase())
      ).map((filename) => {
        const filePath = path.join(uploadsDir, filename);
        const fileStats = fs.statSync(filePath);
        return {
          filename,
          mimetype: 'application/octet-stream',
          encoding: '7bit',
          url: `/uploads/${filename}`,
        };
      });
      return filesList;
    },
  },

  Mutation: {
    addAnimation: (parent, { id, name, metadata }) => {
      const animation = { id, name, metadata };
      animations.push(animation);
      return animation;
    },
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const filePath = path.join(__dirname, '../uploads', filename);

      
      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const url = `/uploads/${filename}`;
      return { filename, mimetype, encoding, url };
    },
    downloadFile: async (_, { url }) => {
    
      return `http://localhost:4000${url}`;
    },
  },
};

module.exports = resolvers;
