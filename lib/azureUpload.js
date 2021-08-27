//Requirements
const blobService = require("azure-storage").createBlobService();
const getStream = require("into-stream");
const { statusCode, internalError } = require("./constant");
const sharp = require("sharp");

const AZURE_URL = "https://zotaprodiag.blob.core.windows.net";
const containerName = "community-fileshare";

//To get the blob
const getBlobName = (originalName) => {
  // remove "0." from start of string
  const identifier = Math.random().toString().replace(/0\./, "");
  return `${identifier}-${originalName}`;
};

//To validate if the file is present or not
const validateFile = (file) => {
  if (!file) {
    throw new Error("File is not found");
  }
};

//To upload a file ,it resizes the image and once it is done then it returns us a url and blobName
const uploadFile = (file) =>
  new Promise((resolve, reject) => {
    try {
      validateFile(file);

      const type = { contentSettings: { contentType: file.mimetype } },
        blobName = getBlobName(file.originalname);
      let stream = getStream(file.buffer),
        streamLength = file.buffer.length;
      if (file.mimetype.includes("image")) {
        sharp(file.buffer)
          .resize(600, 600, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .toBuffer()
          .then((data) => {
            (stream = getStream(data)), (streamLength = data.length);
          });
      }

      blobService.createBlockBlobFromStream(
        containerName,
        blobName,
        stream,
        streamLength,
        type,
        (err) => {
          if (err) {
            
            reject(err);
          } else {
            const response = {
              status: statusCode.Success,
              message: "File Uploaded Successfully",
              url: `${AZURE_URL}/${containerName}/${blobName}`,
              blobName: blobName,
            };
            
            resolve(response);
          }
        }
      );
    } catch (e) {
      
      const errObj = {
        status: statusCode.InvalidData,
        message: e.message,
      };
      reject(errObj);
    }
  });


  //To upload more than one files:
  /*It takes in an array of files and then using the above uploadFile function loops over the array and 
  at the end returns us 'result' array which contains object {url,blobName}, the response along with the 'result' array 
  is received only after the last file is uploaded and not for each file  */
const uploadFiles = (files) =>
  new Promise(async (resolve, reject) => {
    try {
      if (files.length == 0)
        resolve({
          status: statusCode.Success,
          message: "Files Uploaded Successfully",
          results: [],
        });

      let results = [];

      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i])
          .then((uploadFileResult) => {
            if (uploadFileResult.status == 200) {
              results.push({
                url: uploadFileResult.url,
                blobName: uploadFileResult.blobName,
              });
            }

            if (i === files.length - 1) {
              const response = {
                status: statusCode.Success,
                message: "Files Uploaded Successfully",
                results: results,
              };
              resolve(response);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    } catch (e) {
      
      const errObj = {
        status: statusCode.InvalidData,
        message: e.message,
      };
      reject(errObj);
    }
  });

  

//To validate if blob is present or not
validateDeleteFile=(file)=>{
  if(!file.blobName){
    throw new Error("Blob Name not mentioned in the body");
  }
  
}

//To delete a file using deleteBlobIfExists 
const deleteFile=(file) =>
new Promise((resolve, reject) => {
  try {
      validateDeleteFile(file);

      blobService.deleteBlobIfExists(
        containerName,
        file.blobName,
        (error) => {
          if (error) {
            const errObj = {
              status: statusCode.InvalidData,
              message: error.message,
            };
            reject(errObj);
          }
        }
      )

  } catch (e) {
    
    const errObj = {
      status: statusCode.InvalidData,
      message: e.message,
    };
    reject(errObj);
  }
});

//To delete an array of files
//It iterates over the array and then in each iteration of for loop, it makes use of the above deleteFile function to delete that file
const deleteFiles = (files) =>
  new Promise(async (resolve, reject) => {
    try {
      if (files.length == 0)
        resolve({
          status: statusCode.Success,
          message: "Files Deleted Successfully",
       
        });


      for (let i = 0; i < files.length; i++) {
        validateDeleteBody(files[i]);
        await deleteFile(files[i])
          .then((deletFileResult) => {
            if (deletFileResult.status !== 200) {
              const errObj = {
                status: deletFileResult.status,
                message: 'File deletion failed',
              };
              reject(errorObj);

            }

            if (i === files.length - 1) {
              const response = {
                status: statusCode.Success,
                message: "Files Deleted Successfully",
                results: results,
              };
              resolve(response);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    } catch (e) {
      
      const errObj = {
        status: statusCode.InvalidData,
        message: e.message,
      };
      reject(errObj);
    }
  });

module.exports = {
    uploadFile,
    uploadFiles,
    deleteFile,
    deleteFiles
};