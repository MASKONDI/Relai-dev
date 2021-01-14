// send doc to verifier and water mark pluse time stamp code start
exports.request_doc = async (req, res, next) => {

  console.log("...........................................request_doc start*******....................................");


  var client_id = req.session.user_id;
  var reflect_id = req.body.reflect_id;
  var verifier_id = req.body.verifier_id;
  var ver_ref_id = req.body.verifier_reflect_id;
  var sub_cat_id = req.body.sub_cat_id
  var p_cat_id = req.body.p_cat_id
  var note = req.body.note


  const request_code = generateUniqueId({
    length: 6,
    useLetters: false
  });

  var all_doc_length
  var array_of_water_mark = []
  var doc_id = [];
  var download = [];
  var view = [];
  var certify = [];
  var self_certify = [];
  var complete = [];
  var video_proof = [];
  var sign = [];

  doc_id = JSON.parse(req.body.total_doc);
  download = JSON.parse(req.body.download);
  view = JSON.parse(req.body.view);
  certify = JSON.parse(req.body.certify);

  self_certify = JSON.parse(req.body.self_certify);
  complete = JSON.parse(req.body.complete);
  video_proof = JSON.parse(req.body.video_proof);
  sign = JSON.parse(req.body.sign);

  console.log(".....***   video_proofvideo_proofvideo_proof ****.....", video_proof);
  console.log(".....*** self_certifyself_certifyself_certify  ****.....", self_certify);



  await db.query(`SELECT * FROM tbl_files_docs  WHERE tbl_files_docs.user_doc_id IN (${doc_id}) AND tbl_files_docs.deleted="0"`, { type: db.QueryTypes.SELECT })

    .then(async (all_doc) => {

      console.log("first step doc find query", all_doc);

      var i = 0
      all_doc_length = all_doc.length

      async.each(all_doc, async function (content, cb) {

        if (content.type == "video") {

          file_id = content.file_id
          user_doc_id = content.user_doc_id
          await upload_water_mark(content.file_content, "null", "null", user_doc_id, file_id, "video")

        } else if (content.type == "pdf") {

          file_id = content.file_id
          user_doc_id = content.user_doc_id

          if (content.self_attested_hash) {
            await upload_water_mark(content.self_attested_hash, "yes", "null", user_doc_id, file_id, "pdf")

          }
          else {

            await upload_water_mark(content.file_content, "no", "null", user_doc_id, file_id, "pdf")
          }

        } else {

          if (content.self_attested_hash) {

            await request(`https://ipfs.io/ipfs/${content.self_attested_hash}`, async function (error, response, body) {


              if (!error && response.statusCode == 200) {
                var self_att = "yes"
                docImage = dataUriToBuffer(body);
                end_value = i
                user_doc_id = content.user_doc_id
                file_id = content.file_id
                await upload_water_mark(docImage, self_att, end_value, user_doc_id, file_id, "image");
                i++
              } else {

                console.log("ipfs err", error)
                res.send(error)
              }

            })



          } else {
            var self_att = "no"
            docImage = `https://ipfs.io/ipfs/${content.file_content}`
            end_value = i
            user_doc_id = content.user_doc_id
            file_id = content.file_id
            await upload_water_mark(docImage, self_att, end_value, user_doc_id, file_id, "image");
            i++

          }


        }

      })



    })
    .catch(err => console.log("file doc", err))



  async function upload_water_mark(file_hash, self_att, end_value, user_doc_id, file_id, type) {
    console.log("inside water mark function,,,,,,,,,", end_value)


    if (type == "video") {

      array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: file_hash, doc_type: "video" })

      if (array_of_water_mark.length == (all_doc_length)) {

        console.log("semiFinalRespone respone.", array_of_water_mark);

        await semiFinalRespone()

      } else {
        console.log("both array length not equle error")

      }

    } else if (type == "pdf") {


      const run = async (OldHash, self_att) => {

        let promins = new Promise(async (resolve, reject) => {
          console.log("hello 0")

          const url = `https://ipfs.io/ipfs/${OldHash}`

          const pdf1 = await fetch(url).then(res => res.arrayBuffer())
          console.log("pdf1 : ", pdf1)
          resolve(pdf1)


        })

        await promins.then(async pdf1 => {

          // console.log("pdf1 ",pdf1)
          // const fileUrl = new URL(`https://ipfs.io/ipfs/${hashes[j].hash}`);



          // const pdfDoc = await PDFDocument.load(pdf1)

          console.log("hello 1")
          const pdfDoc = await PDFDocument.load(pdf1);

          console.log("hello 2")

          const img_icon = await pdfDoc.embedPng(fs.readFileSync(__dirname + '/../../public/assets/images/logo-white.png'));

          console.log("hello 3")
          // let icon_image =  await Jimp.read(__dirname+'/../../public/assets/images/logo-white.png')

          // console.log(" pathToPDF ",fs.readFileSync(pathToImage))
          // console.log(" pathToImage ",img)

          const imagePage = pdfDoc.insertPage(0);
          console.log("hello 4")

          // date = date.toString()
          // imagePage.drawText(date, { x:0, y: 90, size: 8 })



          console.log("hello 5")


          imagePage.drawImage(img_icon, {
            x: 200,
            y: 300,
            width: imagePage.getWidth() / 3,
            height: imagePage.getHeight() / 3
          });
          console.log("hello 6")

          const pdfBytes = await pdfDoc.save();
          console.log("hello 7")


          let testBuffer = new Buffer(pdfBytes);

          console.log(" pathToImage ", testBuffer)
          console.log("hello 8")

          await ipfs.files.add(testBuffer, async function (err, file) {
            if (err) {
              //  console.log("err from ejs",err);
            }

            console.log("from ipfs self_attested_hash:file[0].hash text_img", file[0].hash);

            if (self_att == 'yes') {
              console.log("inner self_att  w/o attested: ", self_att, " OldHash : ", OldHash);

              array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: OldHash, doc_type: "pdf" })
            } else {
              console.log("inner self_att attested : ", self_att, " file[0].hash ", file[0].hash);

              array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: file[0].hash, doc_type: "pdf" })
            }



            if (array_of_water_mark.length == (all_doc_length)) {

              console.log("semiFinalRespone respone.", array_of_water_mark);

              await semiFinalRespone()

            } else {
              console.log("both array length not equle error")

            }

          })
        })


      }


      await run(file_hash, self_att);


    }
    else {

      var w_text = ""

      let icon_image = await Jimp.read(__dirname + '/../../public/assets/images/logo-white.png')

      await Jimp.read(file_hash, async function (err, image) {

        if (err) {
          console.log("jimp error", err);
          res.send(err)
        }

        console.log("image.bitmap", image.bitmap)
        console.log("image-----------1 ");

        await Jimp
          .create(image.bitmap.width, image.bitmap.height + ((image.bitmap.width / 4) + 30), '#ffffff', async function (err, nova_new) {

            if (err) {
              console.log("jimp2 error", err);
              res.send(err)
            }

            console.log("hello-----------2 ");
            await icon_image.resize((image.bitmap.width / 4) / 2, (image.bitmap.width / 4) / 2);

            await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK, async function (err, font) {

              if (err) {
                console.log("jimp3 error", err);
                res.send(err)
              }

              console.log("hello-----------3 ");

              if (self_att != "yes") {

                nova_new.composite(icon_image, ((image.bitmap.width) - (image.bitmap.width / 4)), image.bitmap.height);

              }

              nova_new.print(font, (image.bitmap.width / 4) / 3, image.bitmap.height, w_text,)

              nova_new.composite(image, 0, 0);

              console.log("nova_new.resize", nova_new)

              console.log("hello-----------4 ");

              var d = await nova_new.getBase64Async(Jimp.MIME_PNG)

              console.log("hello-----------5 ");

              let testBuffer = new Buffer(d);

              var e = await ipfs.files.add(testBuffer, async function (err, file) {

                if (err) {

                  console.log("add ipfs error", err);
                  res.send(err)

                } else {

                  console.log("hello-----------7 ");

                  array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: file[0].hash, doc_type: "image" })
                  console.log("hello-----------8 ");

                  if (array_of_water_mark.length == (all_doc_length)) {

                    console.log("semiFinalRespone respone.", array_of_water_mark);

                    await semiFinalRespone()

                  } else {
                    console.log("both array length not equle error")

                  }


                }

              })


            })





          })

      });


    }
  }

  async function semiFinalRespone() {
    console.log("inside semifinal function,,,,,,,,,,,,,,,,,,,,,,,");

    await db.query("select * from tbl_admin_durations", { type: db.QueryTypes.SELECT })

      .then(async function (due_date_data) {

        var duration = due_date_data[0].counting;
        var dt = new Date();

        if (due_date_data[0].duration == "month") {

          dt.setMonth(dt.getMonth() + parseInt(duration));

        }

        await MyReflectIdModel.findOne({ where: { deleted: "0", reflect_id: reflect_id } })
          .then(async (c_re_data) => {

            UserModel.hasMany(MyReflectIdModel, { foreignKey: 'reg_user_id' })
            MyReflectIdModel.belongsTo(UserModel, { foreignKey: 'reg_user_id' })
            await MyReflectIdModel.findOne({ where: { deleted: "0", reflect_id: ver_ref_id }, include: [UserModel] })
              .then(async (v_re_data) => {

                var request_pin = v_re_data.reflect_code + c_re_data.reflect_code + decrypt(v_re_data.tbl_user_registration.user_pin)
                var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
                var mystr = mykey.update(request_pin, 'utf8', 'hex')
                mystr += mykey.final('hex');
                var cript_64_request_pin = mystr



                await ClientVerificationModel.create({
                  request_code: request_code,
                  verifier_id: verifier_id,
                  verifer_my_reflect_id: ver_ref_id,
                  reflect_id: reflect_id,
                  client_id: client_id,
                  request_pin: cript_64_request_pin,
                  p_category_id: p_cat_id,
                  sub_category_id: sub_cat_id,
                  due_date: dt
                })
                  .then(async (verifyRequest) => {

                    var request_id = verifyRequest.request_id;
                    await UserModel.findOne({ where: { reg_user_id: client_id } })
                      .then(async (userData) => {

                        await NotificationModel.create({
                          notification_msg: `You have recieved a request from ${decrypt(userData.full_name)}.`,
                          sender_id: client_id,
                          receiver_id: verifier_id,
                          request_id: request_id,
                          notification_type: '1',
                          notification_date: new Date()
                        })

                          .then(async (notification) => {

                            console.log("notification done........");

                            let k = 0
                            // await a<sync.each(doc_id,async function (content, cb) {
                            for (let i = 0; i <= doc_id.length; i++) {


                              console.log(".....***   video_proofvideo_proofvideo_proof ****.....", i, ' ------- ', video_proof[i]);
                              console.log(".....*** self_certifyself_certifyself_certify  ****.....", i, ' ------- ', self_certify[i]);

                              console.log(" doc_id :::: ", doc_id)


                              await RequestDocumentsModel
                                .create({
                                  request_id: request_id,
                                  user_doc_id: doc_id[i],
                                  download: download[i],
                                  view: view[i],
                                  certified: certify[i],
                                  sign: sign[i],
                                  complete: complete[i],
                                  video_proof: video_proof[i],
                                  self_certify: self_certify[i],
                                  message: note
                                })

                                .then(async (success) => {
                                  // k++;
                                  console.log("outside if final respones call k length", i, "  doc id length", doc_id.length - 1);

                                  if (i == (doc_id.length - 1)) {
                                    console.log("final response$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");


                                    await FinalRespone(request_id);

                                  }
                                  // k++

                                })
                                .catch(err => console.log("RequestDocumentsModel err", err))



                              // })
                            }

                          })

                      }).catch(err => { console.log(" UserModel", err), res.send(err) })

                  }).catch(err => { console.log(" ClientVerificationModel", err), res.send(err) })


              }).catch(err => { console.log("MyReflectIdModel MyReflectIdModel", err), res.send(err) })
          }).catch(err => { console.log("MyReflectIdModel", err), res.send(err) })
      })
      .catch(err => { console.log("semifinalERROR", err), res.send(err) })

  }

  async function FinalRespone(request_id) {

    console.log("inside FinalRespone........########################");


    await db
      .query('SELECT * FROM tbl_request_documents WHERE request_id=' + request_id + ' AND deleted="0"', { type: db.QueryTypes.SELECT })

      .then(async (requestDocumentData) => {
        var new_hash_array = []
        var countForSend = 0

        console.log("out side loop ++++++++++++++++++++++");

        let z = 0
        // for(var z=0; z<requestDocumentData.length;z++)
        // {
        await async.each(requestDocumentData, async function (requestDocument, cb) {

          await db
            .query('SELECT * FROM tbl_request_documents INNER JOIN tbl_files_docs ON tbl_request_documents.user_doc_id=tbl_files_docs.user_doc_id INNER JOIN tbl_client_verification_requests ON tbl_request_documents.request_id= tbl_client_verification_requests.request_id WHERE tbl_request_documents.request_id=' + request_id + ' AND tbl_request_documents.deleted="0" AND tbl_files_docs.deleted="0" AND tbl_request_documents.user_doc_id=' + requestDocument.user_doc_id, { type: db.QueryTypes.SELECT })
            .then(async (SortrequestDocumentData) => {

              console.log("inside side loop ________________________-------------", SortrequestDocumentData);

              //  z = z==0 ? 0 : z
              let m = 0
              await async.each(SortrequestDocumentData, async function (content1, cb) {

                console.log("inside side aysnc loop ________________________-------------",);
                let x = 0
                await async.each(array_of_water_mark, async function (water_array, cb) {

                  console.log("inside side 2nd aysnc loop ________________________-------------", array_of_water_mark);

                  console.log("content1.file_id array_of_water_mark.file_id ", content1.file_id, water_array.file_id);

                  if (content1.file_id == water_array.file_id) {

                    console.log("if inside match", water_array.doc_type);

                    await RequestFilesModel.create({
                      request_doc_id: content1.request_doc_id,
                      request_file_hash: water_array.request_file_hash,
                      doc_type: water_array.doc_type
                    })
                      .then(async (dataForReturn) => {

                        console.log("outside succes z ", z, SortrequestDocumentData.length - 1);

                        if (z == (SortrequestDocumentData.length - 1)) {
                          console.log("inside succes");

                          res.send("success")

                        }


                      }).catch(err => console.log("RequestFilesModel err", err))

                  }

                  if (x == (array_of_water_mark.length - 1)) {

                    z++

                  } else {

                    x++

                  }


                })



              })
            })

          // }
        })

      })

  }
}

//---end----



// water mark----
async function upload_water_mark(file_hash, self_att, end_value, user_doc_id, file_id, type) {
  console.log("inside water mark function,,,,,,,,,", end_value)


  if (type == "video") {

    array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: file_hash, doc_type: "video" })

    if (array_of_water_mark.length == (all_doc_length)) {

      console.log("semiFinalRespone respone.", array_of_water_mark);

      await semiFinalRespone()

    } else {
      console.log("both array length not equle error")

    }

  } else if (type == "pdf") {


    const run = async (OldHash, self_att) => {

      let promins = new Promise(async (resolve, reject) => {
        console.log("hello 0")

        const url = `https://ipfs.io/ipfs/${OldHash}`

        const pdf1 = await fetch(url).then(res => res.arrayBuffer())
        console.log("pdf1 : ", pdf1)
        resolve(pdf1)


      })

      await promins.then(async pdf1 => {

        // console.log("pdf1 ",pdf1)
        // const fileUrl = new URL(`https://ipfs.io/ipfs/${hashes[j].hash}`);



        // const pdfDoc = await PDFDocument.load(pdf1)

        console.log("hello 1")
        const pdfDoc = await PDFDocument.load(pdf1);

        console.log("hello 2")

        const img_icon = await pdfDoc.embedPng(fs.readFileSync(__dirname + '/../../public/assets/images/logo-white.png'));

        console.log("hello 3")
        // let icon_image =  await Jimp.read(__dirname+'/../../public/assets/images/logo-white.png')

        // console.log(" pathToPDF ",fs.readFileSync(pathToImage))
        // console.log(" pathToImage ",img)

        const imagePage = pdfDoc.insertPage(0);
        console.log("hello 4")

        // date = date.toString()
        // imagePage.drawText(date, { x:0, y: 90, size: 8 })



        console.log("hello 5")


        imagePage.drawImage(img_icon, {
          x: 200,
          y: 300,
          width: imagePage.getWidth() / 3,
          height: imagePage.getHeight() / 3
        });
        console.log("hello 6")

        const pdfBytes = await pdfDoc.save();
        console.log("hello 7")


        let testBuffer = new Buffer(pdfBytes);

        console.log(" pathToImage ", testBuffer)
        console.log("hello 8")

        await ipfs.files.add(testBuffer, async function (err, file) {
          if (err) {
            //  console.log("err from ejs",err);
          }

          console.log("from ipfs self_attested_hash:file[0].hash text_img", file[0].hash);

          if (self_att == 'yes') {
            console.log("inner self_att  w/o attested: ", self_att, " OldHash : ", OldHash);

            array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: OldHash, doc_type: "pdf" })
          } else {
            console.log("inner self_att attested : ", self_att, " file[0].hash ", file[0].hash);

            array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: file[0].hash, doc_type: "pdf" })
          }



          if (array_of_water_mark.length == (all_doc_length)) {

            console.log("semiFinalRespone respone.", array_of_water_mark);

            await semiFinalRespone()

          } else {
            console.log("both array length not equle error")

          }

        })
      })


    }


    await run(file_hash, self_att);


  }
  else {

    var w_text = ""

    let icon_image = await Jimp.read(__dirname + '/../../public/assets/images/logo-white.png')

    await Jimp.read(file_hash, async function (err, image) {

      if (err) {
        console.log("jimp error", err);
        res.send(err)
      }

      console.log("image.bitmap", image.bitmap)
      console.log("image-----------1 ");

      await Jimp
        .create(image.bitmap.width, image.bitmap.height + ((image.bitmap.width / 4) + 30), '#ffffff', async function (err, nova_new) {

          if (err) {
            console.log("jimp2 error", err);
            res.send(err)
          }

          console.log("hello-----------2 ");
          await icon_image.resize((image.bitmap.width / 4) / 2, (image.bitmap.width / 4) / 2);

          await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK, async function (err, font) {

            if (err) {
              console.log("jimp3 error", err);
              res.send(err)
            }

            console.log("hello-----------3 ");

            if (self_att != "yes") {

              nova_new.composite(icon_image, ((image.bitmap.width) - (image.bitmap.width / 4)), image.bitmap.height);

            }

            nova_new.print(font, (image.bitmap.width / 4) / 3, image.bitmap.height, w_text,)

            nova_new.composite(image, 0, 0);

            console.log("nova_new.resize", nova_new)

            console.log("hello-----------4 ");

            var d = await nova_new.getBase64Async(Jimp.MIME_PNG)

            console.log("hello-----------5 ");

            let testBuffer = new Buffer(d);

            var e = await ipfs.files.add(testBuffer, async function (err, file) {

              if (err) {

                console.log("add ipfs error", err);
                res.send(err)

              } else {

                console.log("hello-----------7 ");

                array_of_water_mark.push({ file_id, user_doc_id, request_file_hash: file[0].hash, doc_type: "image" })
                console.log("hello-----------8 ");

                if (array_of_water_mark.length == (all_doc_length)) {

                  console.log("semiFinalRespone respone.", array_of_water_mark);

                  await semiFinalRespone()

                } else {
                  console.log("both array length not equle error")

                }


              }

            })
          })
        })
    });
  }
}


//---end-----

/** self-attested Post Method Start  **/
exports.self_attested = async (req, res, next) => {
  console.log("*****************************************************self_attested start******************************************")

  var user_doc_id = req.body.attested_doc_id;
  var blob_url = req.body.blob_url;
  var reflect_id = req.body.reflect_id;
  var text_for_signature = req.body.text_for_signature;
  let name_details = " ";
  var user_id = req.session.user_id;
  let date = new Date()
  //    text_for_signature =  text_for_signature+" - "+new Date()
  //    console.log('&&&&&&&&&&&&&&&&&&&&& text_for_signature',text_for_signature)
  let attachments = [];
  // console.log("sign",blob_url);
  // console.log("user_doc_id",user_doc_id);
  var hashes = [];
  console.log("reflect_id.....", reflect_id)

  await MyReflectIdModel.findOne({ where: { reflect_id: reflect_id } })
    .then(async dataOfReflect => {

      console.log("data", dataOfReflect)
      let reflect_code = dataOfReflect.reflect_code

      if (dataOfReflect.entity_company_name) {
        name_details = dataOfReflect.entity_company_name;
      }
      else if (dataOfReflect.rep_firstname) {
        name_details = dataOfReflect.rep_firstname;

      }
      else {
        name_details = dataOfReflect.full_name;

      }
      let objOFNames = {
        reflect_code,
        name_details,
        text_for_signature

      }

      await FilesDocModel.findAll({ where: { user_doc_id: user_doc_id, type: { [sequelize.Op.not]: 'video' }, deleted: '0' } }).then(async all_doc_hash => {

        console.log("all_doc_hash", all_doc_hash)

        for (var i = 0; i < all_doc_hash.length; i++) {

          hashes.push({ hash: all_doc_hash[i].file_content, type: all_doc_hash[i].type });

        }

        //  console.log("-------hashes---------" ,hashes);
        await DocumentReflectIdModel.update({ self_assested: 'yes', dig_signature: blob_url }, { where: { user_doc_id: user_doc_id } })
          .then(async results => {


            for (var j = 0; j < hashes.length; j++) {

              fun_hash = hashes[j].hash;
              var j_val, hashes_length;
              hashes_length = hashes.length;
              j_val = j + 1;

              if (hashes[j].type == "image") {

                console.log('&&&&&&&&&&&&&&&&&&&&& j_val : ', j_val, ' hashes_length : ', hashes.length, text_for_signature)

                var data_img = await get_digi_hash(fun_hash, blob_url, user_doc_id, user_id, j_val, hashes_length, objOFNames);


              } else {

                console.log("this is the pdf=============================================")

                var srcImage = blob_url.split(',')[1];
                const buff = Buffer.from(srcImage, 'base64');
                buff.toString();

                const run = async (OldHash, j_val, hashes_length) => {

                  let promins = new Promise(async (resolve, reject) => {
                    console.log("hello 0")

                    const url = `https://ipfs.io/ipfs/${hashes[j].hash}`

                    const pdf1 = await fetch(url).then(res => res.arrayBuffer())
                    console.log("pdf1 : ", pdf1)
                    resolve(pdf1)


                  })

                  await promins.then(async pdf1 => {

                    // console.log("pdf1 ",pdf1)
                    // const fileUrl = new URL(`https://ipfs.io/ipfs/${hashes[j].hash}`);



                    // const pdfDoc = await PDFDocument.load(pdf1)

                    console.log("hello 1")
                    const pdfDoc = await PDFDocument.load(pdf1);

                    console.log("hello 2")

                    const img = await pdfDoc.embedPng(buff);
                    const img_icon = await pdfDoc.embedPng(fs.readFileSync(__dirname + '/../../public/assets/images/logo-white.png'));

                    console.log("hello 3")
                    // let icon_image =  await Jimp.read(__dirname+'/../../public/assets/images/logo-white.png')

                    // console.log(" pathToPDF ",fs.readFileSync(pathToImage))
                    // console.log(" pathToImage ",img)

                    var name_text = objOFNames.name_details + "- " + objOFNames.reflect_code
                    const imagePage = pdfDoc.insertPage(0);
                    console.log("hello 4")

                    date = date.toString()
                    imagePage.drawText(date, { x: 0, y: 75, size: 8 })

                    imagePage.drawText(name_text, { x: 10, y: 95, size: 10 })

                    if (objOFNames.text_for_signature) {
                      imagePage.drawText(objOFNames.text_for_signature, { x: 10, y: 80, size: 10 })
                    }

                    console.log("hello 5")

                    imagePage.drawImage(img, {
                      x: 0,
                      y: 105,
                      width: imagePage.getWidth() / 5,
                      height: imagePage.getHeight() / 5
                    });
                    imagePage.drawImage(img_icon, {
                      x: 200,
                      y: 300,
                      width: imagePage.getWidth() / 3,
                      height: imagePage.getHeight() / 3
                    });
                    console.log("hello 6")

                    const pdfBytes = await pdfDoc.save();
                    console.log("hello 7")


                    let testBuffer = new Buffer(pdfBytes);

                    console.log(" pathToImage ", testBuffer)
                    console.log("hello 8")

                    await ipfs.files.add(testBuffer, async function (err, file) {
                      if (err) {
                        //  console.log("err from ejs",err);
                      }

                      console.log("from ipfs self_attested_hash:file[0].hash text_img", file[0].hash);

                      await FilesDocModel.update({ self_attested_hash: file[0].hash }, { where: { file_content: OldHash } })
                        .then(async (success) => {
                          // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& user_doc_id &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& : ')

                          //   console.log('&&&&&&&&&&&&&&&&&&&&& j_val : ',j_val,' hashes_length : ',hashes_length)


                          // console.log("hello-----------4333333333 success.user_doc_id result ",user_doc_id);  
                          if (j_val == hashes_length) {
                            //  console.log('INNER  j_val : ',j_val,' hashes_length : ',hashes_length)

                            await selfAttestedMail(user_doc_id, user_id);
                          }

                          // return new Promise(resolve => {
                          //    resolve(result);  
                          // });
                        })

                    })
                  })


                }


                await run(hashes[j].hash, j_val, hashes_length);

              }


              if (j == hashes.length - 1) res.send("success");



            }


            // res.send("success");

          })
      })


    })
    .catch(err => {
      console.log("errr", err)
    })


}
/** self-attested Post Method End  **/


/**add_new_doc Post Method Start  **/
exports.AddNewDoc = async (req, res, next) => {
  // console.log(".........files1.......",req)

  //console.log("**************************************************************************1111111111111*******************************************************")

  const form = formidable({ multiples: true });
  await form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
    }
    console.log(".........files.......", files)
    var ext = path.extname(files.document.name);
    let ext_type = (ext == ".pdf") ? "pdf" : "image";
    console.log("***************22222222222222******************************************************* ext_type", { ext_type, ext })


    // res.send({fields:fields,files:files})
    var exp_date = fields.exp_date
    var doc_name_id = fields.doc_name
    // console.log(".........files.......",files)
    var doc_id_number = fields.id_number
    var reflect_id = fields.reflect_id
    var issue_date = fields.issue_date;
    var issue_place = fields.issue_place;
    var proof_of_address = fields.proof_of_address;


    function makeid(length) {
      var result = '';
      var characters = '1234567890';
      var charactersLength = characters.length;

      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    if (!doc_id_number) {


      doc_id_number = `AUTO${makeid(4)}MYREFLET`
    }

    console.log("doc_id_number : ", doc_id_number)
    //     var exp_date = req.body.exp_date
    //     var doc_name_id= parseInt(req.body.doc_name) 
    //     // console.log(".........req...",req)
    //     var doc= req.file.filename
    //    var doc_id_number =parseInt( req.body.id_number)
    //    var reflect_id=parseInt(req.body.reflect_id) 
    // //    console.log(".........req...",exp_date)

    let testFile = fs.readFileSync(files.document.path);
    let testBuffer = new Buffer(testFile);



    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');


    var document_name = fields.document_name;
    console.log("test of ipfs buffer", testBuffer)
    await ipfs.files.add(testBuffer, async function (err, file) {
      if (err) {
        console.log("err from ejs", err);
      }

      if (document_name) {
        await DocumentMasterModel.create({ document_name: document_name, document_type: "other", createdAt: formatted, updatedAt: formatted }).then(async doc_data => {

          console.log("from issue_date if", doc_data.doc_id);

          await DocumentReflectIdModel.create({ doc_id: doc_data.doc_id, doc_unique_code: doc_id_number, reflect_id: reflect_id, proof_of_address, issue_place, issue_date, expire_date: exp_date }).then(async (doc) => {
            // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&",doc)

            // console.log("logocvjdwsnvjknsdjvnsdfvjfkvh<><><<<sdf",doc.user_doc_id)
            await FilesDocModel.create({ user_doc_id: doc.user_doc_id, file_content: file[0].hash, type: ext_type }).then(async (doc_content) => {


              res.redirect(`/entity?reflect_id=${reflect_id}`)

            }).catch(err => { console.log("errr1 DocumentReflectIdModel", err) })
          }).catch(err => { console.log("errr1 FilesDocModel ", err) })
        })
      }
      else {
        await DocumentReflectIdModel.create({ doc_id: doc_name_id, doc_unique_code: doc_id_number, reflect_id: reflect_id, proof_of_address, issue_place, issue_date, expire_date: exp_date }).then(async (doc) => {
          // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&",doc)

          // console.log("logocvjdwsnvjknsdjvnsdfvjfkvh<><><<<sdf",doc.user_doc_id)
          await FilesDocModel.create({ user_doc_id: doc.user_doc_id, file_content: file[0].hash, type: ext_type }).then(async (doc_content) => {


            res.redirect(`/entity?reflect_id=${reflect_id}`)

          }).catch(err => { console.log("errr1 DocumentReflectIdModel", err) })
        }).catch(err => { console.log("errr1 FilesDocModel ", err) })
      }


    })
  })



  //     var exp_date = req.body.exp_date
  //     var doc_name_id= parseInt(req.body.doc_name) 
  //     // console.log(".........req...",req)
  //     var doc= req.file.filename
  //    var doc_id_number =parseInt( req.body.id_number)
  //    var reflect_id=parseInt(req.body.reflect_id) 
  //    console.log(".........req...",exp_date)
  //    console.log(".........doc_name_id...",doc_name_id)

  //    console.log(".........doc_id_number...",doc_id_number)

  //    console.log(".........reflect_id...",reflect_id)

  //    console.log(".........doc...",doc)


  //   await DocumentReflectIdModel.create({doc_id:doc_name_id,
  //                                        doc_unique_code:doc_id_number,
  //                                        document_filename:doc,
  //                                        reflect_id:reflect_id,
  //                                        expire_date:exp_date}).then(async(data)=>{
  // await MyReflectIdModel.findOne({where:{reflect_id:reflect_id}}).then(async(result) => {



  //   await  DocumentReflectIdModel.findAll({where:{reflect_id:reflect_id}}).then(doc_data=>{
  //         // console.log("documnet moelsbdfbfhdbhfbd.......",doc_data)
  //         res.redirect(`/entity?reflect_id=${reflect_id}`)
  //         // res.render('front/myReflect/my-reflet-id-view-for-entity',{
  //         //     success_msg,
  //         //     err_msg,
  //         //     session:req.session,
  //         //     myreflectEntityData :result,
  //         //     reflect_id:result.reflect_id,
  //         //     DocData: doc_data
  //         // })
  //     }).catch(err=>{console.log("errr1",err)})



  // }).catch(err=>{console.log("errr2",err)})
  //     }).catch(err=>{console.log("errr3",err)})







}
/**add_new_doc Post Method End  **/



/**request_on_boarding Get method Start**/

exports.requestOnBoarding = async (req, res, next) => {
  // console.log("check path   ",__dirname)
  // let testFile = fs.readFileSync(__dirname+'/../../uploads/documents/document_1582884940789_myw3schoolsimage.jpg');
  // let testBuffer = new Buffer(testFile);
  // ipfs.files.add(testBuffer, function (err, file) {
  //   if (err) {
  //     console.log("err from ejs",err);
  //   }
  //   console.log("from ipfs ",file)
  // })
  var userId = req.session.user_id
  // console.log("user idv ", userId)
  var requestarray = []

  var page_accept = req.query.page_accept || 1
  var perPageAccept = 10;
  var page_data_accept = []

  var page = req.query.page || 1
  var perPage = 10;
  var page_data = []

  success_msg = req.flash('success_msg');
  err_msg = req.flash('err_msg');

  db.query("SELECT * FROM `tbl_wallet_reflectid_rels` WHERE user_as='client' and reg_user_id<>" + userId, { type: db.QueryTypes.SELECT }).then(allClients => {
    db.query("SELECT * FROM `tbl_wallet_reflectid_rels` WHERE user_as='verifier' and reg_user_id=" + userId, { type: db.QueryTypes.SELECT }).then(myVerifiers => {
      db.query('SELECT * ,tbl_wallet_reflectid_rels.reflect_code as v_r_code ,tbl_wallet_reflectid_rels.reflectid_by as v_reflectid_by,tbl_wallet_reflectid_rels.rep_username as v_rep_username,tbl_wallet_reflectid_rels.entity_company_name as v_entity_company_name ,tbl_client_verification_requests.createdAt as request_createdAt FROM `tbl_client_verification_requests` INNER JOIN tbl_wallet_reflectid_rels ON tbl_wallet_reflectid_rels.reflect_id=tbl_client_verification_requests.verifer_my_reflect_id INNER JOIN tbl_wallet_reflectid_rels as c ON c.reflect_id=tbl_client_verification_requests.reflect_id INNER JOIN tbl_user_registrations ON tbl_user_registrations.reg_user_id=tbl_client_verification_requests.client_id  WHERE tbl_client_verification_requests.verifier_id="' + userId + '" AND tbl_client_verification_requests.deleted="0" AND tbl_client_verification_requests.request_status="accept" AND tbl_client_verification_requests.removed_request="no" order by request_id desc', { type: db.QueryTypes.SELECT }).then(RequsetOnBoardingACCEPT => {

        db.query('SELECT * ,tbl_wallet_reflectid_rels.reflect_code as v_r_code ,tbl_wallet_reflectid_rels.reflectid_by as v_reflectid_by,tbl_wallet_reflectid_rels.rep_username as v_rep_username,tbl_wallet_reflectid_rels.entity_company_name as v_entity_company_name, tbl_client_verification_requests.createdAt as request_createdAt FROM `tbl_client_verification_requests` INNER JOIN tbl_wallet_reflectid_rels ON tbl_wallet_reflectid_rels.reflect_id=tbl_client_verification_requests.verifer_my_reflect_id INNER JOIN tbl_wallet_reflectid_rels as c ON c.reflect_id=tbl_client_verification_requests.reflect_id INNER JOIN tbl_user_registrations ON tbl_user_registrations.reg_user_id=tbl_client_verification_requests.client_id  WHERE tbl_client_verification_requests.verifier_id="' + userId + '" AND tbl_client_verification_requests.deleted="0" AND tbl_client_verification_requests.request_status="pending" AND tbl_client_verification_requests.removed_request="no" order by request_id desc', { type: db.QueryTypes.SELECT }).then(RequsetOnBoardingPending => {

          db.query('SELECT *,tbl_wallet_reflectid_rels.reflect_code as v_r_code ,tbl_wallet_reflectid_rels.reflectid_by as v_reflectid_by,tbl_wallet_reflectid_rels.rep_username as v_rep_username,tbl_wallet_reflectid_rels.entity_company_name as v_entity_company_name ,tbl_client_verification_requests.createdAt as request_createdAt FROM `tbl_sub_verifier_clients` INNER JOIN tbl_client_verification_requests ON tbl_client_verification_requests.request_id=tbl_sub_verifier_clients.client_request_id INNER JOIN tbl_wallet_reflectid_rels ON tbl_wallet_reflectid_rels.reflect_id=tbl_client_verification_requests.verifer_my_reflect_id INNER JOIN tbl_wallet_reflectid_rels as c ON c.reflect_id=tbl_client_verification_requests.reflect_id INNER JOIN tbl_user_registrations ON tbl_user_registrations.reg_user_id=tbl_client_verification_requests.client_id WHERE tbl_sub_verifier_clients.sub_verifier_reg_id="' + userId + '" AND tbl_sub_verifier_clients.deleted="0" AND tbl_sub_verifier_clients.sub_client_status="active" AND tbl_client_verification_requests.deleted="0" AND tbl_client_verification_requests.removed_request="no" order by request_id desc', { type: db.QueryTypes.SELECT }).then(subverifierAssignClient => {

            for (let i = 0; i < subverifierAssignClient.length; i++) {
              if (subverifierAssignClient[i].request_status == "pending") {
                RequsetOnBoardingPending.push(subverifierAssignClient[i])
              }
              if (subverifierAssignClient[i].request_status == "accept") {
                subverifierAssignClient[i].allocated = { sub_ver_my_reflect_id: subverifierAssignClient[i].sub_verifier_reflect_id }

                RequsetOnBoardingACCEPT.push(subverifierAssignClient[i])
              }

            }
            console.log("page_acceptpage_acceptpage_accept ::: ", page_accept)
            console.log("boarding pending", RequsetOnBoardingPending.length)
            console.log("boarding accept", RequsetOnBoardingACCEPT.length)


            page_data_accept = RequsetOnBoardingACCEPT;
            page_data = RequsetOnBoardingPending;


            const RequsetOnBoardingPendingData = paginate(page_data, page, perPage);
            const RequsetOnBoardingACCEPTData = paginate(page_data_accept, page_accept, perPageAccept);

            // console.log("boarding pending data",RequsetOnBoardingACCEPTData)S

            res.render('front/user-on-boarding-request/boarding-request', {
              RequsetOnBoardingACCEPT: RequsetOnBoardingACCEPTData,
              RequsetOnBoardingPending: RequsetOnBoardingPendingData,
              session: req.session, allClients, myVerifiers,
              //ClientVerificationModelData :requestarray,
              moment, success_msg
            })
          })
        })
      })

    })

  })


  //   await ClientVerificationModel.findAll({where:{verifier_id: userId } }).then(async(data)=>{
  //        console.log(".......................................................")
  //        var count =1
  //        for(var i=0; i<data.length ;i++){
  //           count++
  //           await MyReflectIdModel.findOne({where:{reflect_id:data[i].reflect_id }}).then(async(myRefdata)=>
  //           {  

  //               UserModel.hasMany(MyReflectIdModel, {foreignKey: 'reg_user_id'})
  //              MyReflectIdModel.belongsTo(UserModel, {foreignKey: 'reg_user_id'})
  //              await MyReflectIdModel.findOne({where:{reflect_id:data[i].verifer_my_reflect_id },include: [UserModel]}).then(async(v_myRefdata)=>
  //           {
  //            // console.log(v_myRefdata.tbl_user_registration)

  //            // console.log(".......................................................")
  //            // console.log(v_myRefdata.tbl_user_registration.dataValues)
  //           //  var match_to_client_or_veri ;
  //           //      if(data[i].verifier_id==userId){
  //           //        match_to_client_or_veri=data[i].verifier_id
  //           //      }else{
  //               //    match_to_client_or_veri=data[i].client_id
  //               //  }

  //            await UserModel.findOne({where:{reg_user_id:data[i].client_id }}).then(async(userdata)=>{

  //               await UserModel.findOne({where:{reg_user_id:data[i].verifier_id }}).then(async(ver_userdata)=>{

  //               var obj ={
  //                  ClientVerificationData : data[i].dataValues,
  //                  MyReflectIData :myRefdata.dataValues,
  //                  user : userdata.dataValues,
  //                  verifer_my_reflect_id_Data : v_myRefdata,
  //                  ver_userdata :ver_userdata
  //                 }

  //                 requestarray.push(obj)
  //               })
  //            })


  //           })


  //           })
  //        }
  //      //   console.log("user idvddsvdsvdsvdsvds<><> ", count)

  //        res.render('front/user-on-boarding-request/boarding-request',{
  //         session : req.session,
  //         ClientVerificationModelData :requestarray,
  //         moment
  //  })

  //  }).catch(err=>console.log("errr",err))


  // res.render('front/user-on-boarding-request/boarding-request',{session:req.session})

}

/**request_on_boarding Get method End**/


/**request_status_change Get method Start**/
exports.RequestStatusChange = async (req, res, next) => {
  console.log(".............................<><>RequestStatusChange<><.............................................")
  var status = req.query.status
  var user_id = req.session.user_id
  var request_id = req.query.request_id
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');

  var ntf_type;
  if (status == "accept") {
    ntf_type = 2;
  } else {
    ntf_type = 3
  }
  //  console.log("123......................<><><><<<>.........................................................")
  //  console.log(status)
  //  console.log(request_id)

  //  console.log(".............................<><><><.............................................")

  await ClientVerificationModel.update({ request_status: status }, { where: { request_id: request_id } }).then(async (result) => {
    // console.log(result)
    var useradata = await UserModel.findOne({ where: { reg_user_id: user_id } })

    await ClientVerificationModel.findOne({ where: { request_id: request_id } }).then(async (requestdata) => {
      var msg = `Your request has been ${status}ed by verifier ${decrypt(useradata.full_name)}-${requestdata.request_code}.`
      await NotificationModel.create({
        notification_msg: msg,
        sender_id: user_id,
        receiver_id: requestdata.client_id,
        request_id: request_id,
        notification_type: ntf_type,
        notification_date: formatted,
        read_status: "no"
      }).then(data => {
        res.redirect("/request_on_boarding")

      }).catch(err => console.log("err", err))
    }).catch(err => console.log("err", err))

  }).catch(err => console.log("err", err))
}

/**request_status_change Get method End**/


/**accept-request Post method Start**/
exports.accept_request = async (req, res, next) => {

  var request_id = req.body.request_id;
  var blob_url = req.body.blob_url;
  var private_key2 = req.body.private_key.trim();
  // var private_key2  = '0x6765c35c62e998f9de4a9a590c137c8a3845721a398289737beb8178c001faba';

  var private_key1;
  var msg;
  var document_name;
  var user_id = req.session.user_id;
  let client_id;
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');
  let V_R_code;
  let ver_name;
  // var request_file_id = req.body.request_file_id;
  var ver_reflect_id = req.body.ver_reflect_id;
  var client_reflect_id = req.body.client_reflect_id;
  console.log("ver_reflect_id------ ", ver_reflect_id);
  var request_status = 'accepted';
  var reason = "NA";
  var request_doc_id = req.body.request_doc_id;
  //  var count;
  //  var file_id = file_data.split("-")[1];
  //  console.log("file_id----------********------ ",file_id);
  await RequestDocumentsModel.update({ approve_status: "approved" }, { where: { request_doc_id: request_doc_id } }).then(async update_success => {

    await db.query("SELECT * FROM tbl_request_documents_files INNER JOIN tbl_request_documents ON tbl_request_documents_files.request_doc_id=tbl_request_documents.request_doc_id INNER JOIN tbl_myreflectid_doc_rels ON tbl_request_documents.user_doc_id=tbl_myreflectid_doc_rels.user_doc_id INNER JOIN tbl_documents_masters ON tbl_myreflectid_doc_rels.doc_id=tbl_documents_masters.doc_id where tbl_request_documents_files.docfile_status='pending' AND tbl_request_documents_files.request_doc_id=" + request_doc_id, { type: db.QueryTypes.SELECT }).then(async request_doc_data => {
      let count = 0;
      /*outer loop Start*/

      var k = 0;
      // for(var k=0;k<request_doc_data.length;k++){


      var array_of_doc_hash = []
      var string_array_of_doc_hash

      async.each(request_doc_data, async function (content, cb) {



        console.log("*****request_doc_data****** ", content.length);

        console.log("*****request_doc_data k ****** ", k);

        console.log("*****request_doc_data  ****** ", content);



        var self_assested = content.self_assested

        var doc = content.request_file_hash;

        var doc_name = content.document_name;
        document_name = content.document_name;
        var request_file_id = content.request_file_id;
        var request_doc_id = content.request_doc_id
        var version = content.version

        // var request_file_id =request_doc_data[k].request_file_id

        //  await db.query("SELECT * FROM tbl_files_docs INNER JOIN tbl_myreflectid_doc_rels ON tbl_files_docs.user_doc_id=tbl_myreflectid_doc_rels.user_doc_id inner join tbl_documents_masters on tbl_documents_masters.doc_id=tbl_myreflectid_doc_rels.doc_id WHERE tbl_files_docs.file_id="+file_id,{ type:db.QueryTypes.SELECT}).then(async function(file_result){
        //     var doc = file_result[0].file_content;
        //     var doc_name = file_result[0].document_name;
        //     // console.log("file_result----------********------ ",file_result);
        //     var user_reflect_id = file_result[0].reflect_id;
        await db.query("SELECT * FROM tbl_wallet_reflectid_rels INNER JOIN tbl_user_registrations ON tbl_wallet_reflectid_rels.reg_user_id=tbl_user_registrations.reg_user_id WHERE tbl_wallet_reflectid_rels.deleted='0' AND tbl_wallet_reflectid_rels.reflect_id=" + client_reflect_id, { type: db.QueryTypes.SELECT }).then(async function (client_data) {
          // console.log("client_data----------********------ ",client_data);
          client_id = client_data[0].reg_user_id;
          var client_email = decrypt(client_data[0].email);
          var client_myReflect_code = client_data[0].reflect_code;

          await db.query("SELECT * FROM tbl_wallet_reflectid_rels INNER JOIN tbl_user_registrations ON tbl_wallet_reflectid_rels.reg_user_id=tbl_user_registrations.reg_user_id WHERE tbl_wallet_reflectid_rels.deleted='0' AND tbl_wallet_reflectid_rels.reflect_id=" + ver_reflect_id, { type: db.QueryTypes.SELECT }).then(async function (verifier_data) {
            // console.log("verifier_data----------********------ ",verifier_data);
            var verifier_email = decrypt(verifier_data[0].email);
            var verifier_myReflect_code = verifier_data[0].reflect_code;
            var wallet_id = verifier_data[0].wallet_id;
            V_R_code = verifier_data[0].reflect_code;
            ver_name = decrypt(verifier_data[0].full_name);


            var verifier_name;

            if (verifier_data[0].entity_company_name) {
              verifier_name = verifier_data[0].entity_company_name;
            }
            else if (verifier_data[0].rep_firstname) {
              verifier_name = verifier_data[0].rep_firstname;

            }
            else {
              verifier_name = verifier_data[0].full_name;

            }
            await db.query("SELECT * FROM tbl_user_wallets WHERE deleted='0' AND wallet_id=" + wallet_id, { type: db.QueryTypes.SELECT }).then(async function (wallet_data) {
              // console.log("wallet_data----------********------ ",wallet_data);




              const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration))

              var jimp_doc, srcImage, ipfs_width, ipfs_height;
              console.log("before await 1", self_assested);
              console.log("Doc-----2------ ", doc);

              console.log("detail-----2------ ", doc, verifier_name, V_R_code);





              async function wait_hash() {

                //  if (self_assested==='yes') {

                await request(`https://ipfs.io/ipfs/${doc}`, async function (error, response, body) {

                  if (!error && response.statusCode == 200) {

                    srcImage = dataUriToBuffer(body);
                  }


                })
                await delay(10000)


                // }
                //  else
                //  {

                //                     srcImage = `https://ipfs.io/ipfs/${doc}`

                //                      console.log("elseSSSSSSSSSSSSSSSSShello-----------1 ",srcImage);

                //  }  
              }


              console.log("before await1");
              if (content.doc_type == "image") {

                await wait_hash();
                await jimp_fun();

              } else if (content.doc_type == "pdf") {

                console.log(" content.doc_type : ", content.doc_type)

                console.log(" content.doc_type DOCCCCCCC : ", doc)

                const run = async (OldHash) => {

                  let promins = new Promise(async (resolve, reject) => {
                    console.log("hello 0")

                    const url = `https://ipfs.io/ipfs/${OldHash}`

                    const pdf1 = await fetch(url).then(res => res.arrayBuffer())
                    console.log("pdf1 : ", pdf1)
                    resolve(pdf1)


                  })

                  await promins.then(async pdf1 => {




                    const pdfDoc = await PDFDocument.load(pdf1);


                    // const approve_img_icon = await pdfDoc.embedPng(fs.readFileSync(__dirname+'/../../public/assets/images/approve.jpg'));
                    const approve_img_icon = await pdfDoc.embedPng(fs.readFileSync(__dirname + '/../../public/assets/images/approve.png'));

                    console.log("hello 2")


                    console.log("hello 3")


                    const pages = pdfDoc.getPages();
                    const imagePage = pages[0];

                    console.log("hello 4")

                    let message_date = moment(new Date()).format("ddd,MM-D-YYYY")
                    let message_time = moment(new Date()).format("h:mm:ssa")
                    var segImeg = blob_url.split(',')[1];

                    const buff = Buffer.from(segImeg, 'base64');
                    buff.toString();

                    const sign_img = await pdfDoc.embedPng(buff);

                    let date_time = message_date + " " + message_time
                    let ver_text = verifier_name + '-' + V_R_code

                    imagePage.drawText(date_time, { x: 450, y: 95, size: 8 })
                    imagePage.drawText(ver_text, { x: 450, y: 105, size: 10 })

                    // console.log("hello 5 ",imagePage.getWidth()," height : ",imagePage.getHeight())


                    // console.log("hello 5 ",imagePage.getWidth()/9," height : ",imagePage.getHeight()/9)


                    imagePage.drawImage(sign_img, {
                      x: 450,
                      y: 110,
                      width: imagePage.getWidth() / 5,
                      height: imagePage.getHeight() / 5
                    });
                    imagePage.drawImage(approve_img_icon, {
                      x: 450,
                      y: 700,
                      width: imagePage.getWidth() / 8,
                      height: imagePage.getHeight() / 8
                    });
                    console.log("hello 6")

                    const pdfBytes = await pdfDoc.save();
                    console.log("hello 7")


                    let testBuffer = new Buffer(pdfBytes);

                    console.log(" pathToImage ", testBuffer)
                    console.log("hello 8")

                    await ipfs.files.add(testBuffer, async function (err, file) {
                      if (err) {
                        //  console.log("err from ejs",err);
                      }

                      console.log("from ipfs self_attested_hash:file[0].hash text_img", file[0].hash);
                      array_of_doc_hash.push(content.doc_type + '-' + file[0].hash)


                      if (array_of_doc_hash.length == request_doc_data.length) {
                        console.log("inside render if")

                        string_array_of_doc_hash = array_of_doc_hash.toString()
                        await TransactionFunction(string_array_of_doc_hash)

                      }
                    })
                  })

                }
                await run(doc);
                async function TransactionFunction(string_array_of_doc_hash) {


                  console.log("from ipfs self_attested_hash:file[0].hash text_img", string_array_of_doc_hash);

                  // jimp_doc = file[0].hash;
                  jimp_doc = string_array_of_doc_hash;


                  console.log("jimp_doc ejs", doc);


                  var doc = jimp_doc

                  var doc = jimp_doc
                  console.log("jimp_doc ejs", doc);


                  console.log("ALLLLLLLLLLLLLLLLLLLLLLLLLL %$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BLOCKCHAIN DATAAAAAAAAAAAAAAAAA");

                  console.log("doc ejs", doc);

                  // console.log("doc ejs",doc);
                  console.log("verifier_email ejs", verifier_email);
                  console.log("client_email ejs", client_email);
                  console.log("doc_name ejs", doc_name);
                  console.log("verifier_myReflect_code ejs", verifier_myReflect_code);
                  console.log("client_myReflect_code ejs", client_myReflect_code);
                  console.log("request_status ejs", request_status);
                  console.log("request_status ejs", reason);



                  var wallet_address = wallet_data[0].wallet_address;
                  console.log("wallet_address :", wallet_address)

                  //  var wallet_address='0xe9da7cc15e416ab431917f88eddb7314bd709711';
                  let account;
                  var m = private_key2.indexOf("0x");
                  if (m == 0) {
                    private_key1 = private_key2
                    account = web3.eth.accounts.privateKeyToAccount(private_key1);
                    if (!account) {
                      console.log("inside account if 1")
                      res.send({ fail: "true", success: "false" });
                    }
                  } else {
                    private_key1 = '0x' + private_key2;
                    console.log("*************private_key1 ", private_key1);
                    account = web3.eth.accounts.privateKeyToAccount(private_key1);
                    if (!account) {
                      console.log("inside account if 2")

                      res.send({ fail: "true", success: "false" });
                    }
                  }

                  if (account.address != wallet_address) {
                    console.log("inside account if 3")

                    res.send({ fail: "true", success: "false" });
                  }
                  else {
                    console.log("inside account if 4")




                    const user = contractABI;

                    var contract = new web3.eth.Contract(user, contractAddress);
                    // var private_key1 = '0x97d17cf1e4852e681fd778aa95b046b6f47989fb63ede2e7348682d4e14af8e9'
                    var private_key = private_key1.slice(2);
                    var privateKey = Buffer.from(private_key, 'hex');

                    await web3.eth.getTransactionCount(wallet_address).then(async function (v) {
                      console.log("***********v ", v)
                      // if(k==0){
                      //   count = v;
                      // }else if(count==v){
                      //   count = v+1;
                      // }else{
                      count = v;
                      // }             

                      console.log("*********count*********", count);


                      var rawTransaction = {
                        "from": wallet_address,
                        "gasPrice": "0x0",
                        "gasLimit": web3.utils.toHex(4600000),
                        "to": contractAddress,
                        "value": "0x0",
                        "data": contract.methods.addDocument(doc, verifier_email, client_email, doc_name, verifier_myReflect_code, client_myReflect_code, request_status, reason).encodeABI(),
                        "nonce": web3.utils.toHex(count)
                      }

                      console.log('rawTransaction : ', rawTransaction)
                      var transaction = new Tx(rawTransaction);
                      transaction.sign(privateKey);


                      await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, tx_hash) => {
                        console.log("err ", err);
                        console.log("tx_hash ", tx_hash, " request_file_id : ", request_file_id);
                        console.log("request_doc_id ", request_doc_id, " version : ", version);
                        RequestFilesModel.update({ transaction_hash: tx_hash, docfile_status: "accept", reason: reason, updatedAt: moment(new Date()) }, { where: { request_doc_id: request_doc_id, version: version } }).then(success => {

                          console.log('request_file_id : ', request_file_id, "  ^^^^^^^^^^^^ transaction_hash :", tx_hash)
                          //  res.redirect('/pen_request_view_client_info?request_id='+request_id);
                          senddata()
                        }).catch(err => {
                          console.log("**************err********* ", err);
                        })

                      })
                    })
                    // count++;
                  }

                }

              } else {
                // array_of_doc_hash.push({doc_type:content.doc_type,hase:doc})
                array_of_doc_hash.push(content.doc_type + '-' + doc)

                if (array_of_doc_hash.length == request_doc_data.length) {
                  console.log("inside render if")
                  string_array_of_doc_hash = array_of_doc_hash.toString()
                  await TransactionFunction(string_array_of_doc_hash)

                }
                async function TransactionFunction(string_array_of_doc_hash) {


                  console.log("from ipfs self_attested_hash:file[0].hash text_img", string_array_of_doc_hash);

                  // jimp_doc = file[0].hash;
                  jimp_doc = string_array_of_doc_hash;


                  console.log("jimp_doc ejs", doc);


                  var doc = jimp_doc

                  var doc = jimp_doc
                  console.log("jimp_doc ejs", doc);


                  console.log("ALLLLLLLLLLLLLLLLLLLLLLLLLL %$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BLOCKCHAIN DATAAAAAAAAAAAAAAAAA");

                  console.log("doc ejs", doc);

                  // console.log("doc ejs",doc);
                  console.log("verifier_email ejs", verifier_email);
                  console.log("client_email ejs", client_email);
                  console.log("doc_name ejs", doc_name);
                  console.log("verifier_myReflect_code ejs", verifier_myReflect_code);
                  console.log("client_myReflect_code ejs", client_myReflect_code);
                  console.log("request_status ejs", request_status);
                  console.log("request_status ejs", reason);



                  var wallet_address = wallet_data[0].wallet_address;
                  console.log("wallet_address :", wallet_address)

                  //  var wallet_address='0xe9da7cc15e416ab431917f88eddb7314bd709711';
                  let account;
                  var m = private_key2.indexOf("0x");
                  if (m == 0) {
                    private_key1 = private_key2
                    account = web3.eth.accounts.privateKeyToAccount(private_key1);
                    if (!account) {
                      console.log("inside account if 1")
                      res.send({ fail: "true", success: "false" });
                    }
                  } else {
                    private_key1 = '0x' + private_key2;
                    console.log("*************private_key1 ", private_key1);
                    account = web3.eth.accounts.privateKeyToAccount(private_key1);
                    if (!account) {
                      console.log("inside account if 2")

                      res.send({ fail: "true", success: "false" });
                    }
                  }

                  if (account.address != wallet_address) {
                    console.log("inside account if 3")

                    res.send({ fail: "true", success: "false" });
                  }
                  else {
                    console.log("inside account if 4")




                    const user = contractABI;

                    var contract = new web3.eth.Contract(user, contractAddress);
                    // var private_key1 = '0x97d17cf1e4852e681fd778aa95b046b6f47989fb63ede2e7348682d4e14af8e9'
                    var private_key = private_key1.slice(2);
                    var privateKey = Buffer.from(private_key, 'hex');

                    await web3.eth.getTransactionCount(wallet_address).then(async function (v) {
                      console.log("***********v ", v)
                      // if(k==0){
                      //   count = v;
                      // }else if(count==v){
                      //   count = v+1;
                      // }else{
                      count = v;
                      // }             

                      console.log("*********count*********", count);


                      var rawTransaction = {
                        "from": wallet_address,
                        "gasPrice": "0x0",
                        "gasLimit": web3.utils.toHex(4600000),
                        "to": contractAddress,
                        "value": "0x0",
                        "data": contract.methods.addDocument(doc, verifier_email, client_email, doc_name, verifier_myReflect_code, client_myReflect_code, request_status, reason).encodeABI(),
                        "nonce": web3.utils.toHex(count)
                      }

                      console.log('rawTransaction : ', rawTransaction)
                      var transaction = new Tx(rawTransaction);
                      transaction.sign(privateKey);


                      await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, tx_hash) => {
                        console.log("err ", err);
                        console.log("tx_hash ", tx_hash, " request_file_id : ", request_file_id);
                        console.log("request_doc_id ", request_doc_id, " version : ", version);
                        RequestFilesModel.update({ transaction_hash: tx_hash, docfile_status: "accept", reason: reason, updatedAt: moment(new Date()) }, { where: { request_doc_id: request_doc_id, version: version } }).then(success => {

                          console.log('request_file_id : ', request_file_id, "  ^^^^^^^^^^^^ transaction_hash :", tx_hash)
                          //  res.redirect('/pen_request_view_client_info?request_id='+request_id);
                          senddata()
                        }).catch(err => {
                          console.log("**************err********* ", err);
                        })

                      })
                    })
                    // count++;
                  }

                }

              }


              console.log("After await1");
              async function jimp_fun() {

                // let message_date = moment(new Date()).format("h:mm:ssa,ddd,MM-D-YYYY")
                let message_date = moment(new Date()).format("ddd,MM-D-YYYY")
                let message_time = moment(new Date()).format("h:mm:ssa")
                var segImeg = blob_url.split(',')[1];

                const buff = Buffer.from(segImeg, 'base64');
                buff.toString();


                await Jimp.read(buff).then(async newimage => {





                  await Jimp.read(srcImage).then(async image => {
                    await newimage.resize(image.bitmap.width / 4, image.bitmap.width / 4);
                    console.log(newimage.bitmap)
                    let approve_image = await Jimp.read(__dirname + '/../../public/assets/images/approve.jpg')
                    await approve_image.resize(image.bitmap.width / 4, image.bitmap.width / 4);
                    await Jimp.create(image.bitmap.width, ((image.bitmap.height) + ((image.bitmap.width / 4) + 30)), '#ffffff').then(async nova_new => {

                      console.log("hello-----------3 3  ");


                      await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK)
                        .then(async font => {

                          nova_new.print(
                            font,
                            (image.bitmap.width) - (image.bitmap.width / 4),
                            image.bitmap.height + 10,
                            verifier_name + '-' + V_R_code,
                            5,
                            (err, nova_new, { x, y }) => {
                              nova_new.print(font, x, y, message_date, 5,
                                (err, nova_new, { x, y }) => {
                                  nova_new.print(font, x, y, message_time, 5,);
                                });
                            }
                          );

                          //  text_name_code.print(font, x,y,   verifier_name)


                          //  text_date.print(font, x, y + 20,message_date  , 50);


                          console.log("hello-----------3 4  ");
                          nova_new.composite(image, 0, 0)
                          nova_new.composite(newimage, (image.bitmap.width) - (image.bitmap.width / 4), image.bitmap.height);
                          nova_new.composite(approve_image, 0, image.bitmap.height);
                          // nova_new.composite(image,0,text_height)
                          // nova_new.composite(newimage,0,0);


                          console.log("hello-----------55   ");


                          let text_img = nova_new.getBase64Async(Jimp.MIME_PNG);

                          console.log("hello-----------3 ");

                          await text_img.then(async result => {
                            let testBuffer = new Buffer(result);
                            console.log("text_img after 3 ", testBuffer);



                            await ipfs.files.add(testBuffer, async function (err, file) {

                              console.log("from ipfs ", file);

                              if (err) {

                                console.log("err", err);

                              } else {

                                array_of_doc_hash.push(content.doc_type + '-' + file[0].hash)
                                console.log("array_of_doc_hash.length , request_doc_data.length ", array_of_doc_hash.length, request_doc_data.length);
                                if (array_of_doc_hash.length == request_doc_data.length) {
                                  console.log("inside render if")
                                  string_array_of_doc_hash = array_of_doc_hash.toString()
                                  await TransactionFunction(string_array_of_doc_hash)

                                }



                              }

                              await delay(10000)


                            })



                            async function TransactionFunction(string_array_of_doc_hash) {

                              console.log("from ipfs self_attested_hash:file[0].hash text_img", string_array_of_doc_hash);

                              // jimp_doc = file[0].hash;
                              jimp_doc = string_array_of_doc_hash;


                              var doc = jimp_doc
                              console.log("jimp_doc ejs", doc);


                              console.log("ALLLLLLLLLLLLLLLLLLLLLLLLLL %$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BLOCKCHAIN DATAAAAAAAAAAAAAAAAA");

                              console.log("doc ejs", doc);

                              // console.log("doc ejs",doc);
                              console.log("verifier_email ejs", verifier_email);
                              console.log("client_email ejs", client_email);
                              console.log("doc_name ejs", doc_name);
                              console.log("verifier_myReflect_code ejs", verifier_myReflect_code);
                              console.log("client_myReflect_code ejs", client_myReflect_code);
                              console.log("request_status ejs", request_status);
                              console.log("request_status ejs", reason);



                              var wallet_address = wallet_data[0].wallet_address;
                              //  var wallet_address='0x39c40B81acC1F06f3BDEb3A4fE36A8De9753313B';
                              let account;
                              var m = private_key2.indexOf("0x");
                              if (m == 0) {
                                private_key1 = private_key2
                                account = web3.eth.accounts.privateKeyToAccount(private_key1);
                                if (!account) {
                                  console.log("inside account if 1")
                                  res.send({ fail: "true", success: "false" });
                                }
                              } else {
                                private_key1 = '0x' + private_key2;
                                console.log("*************private_key1 ", private_key1);
                                account = web3.eth.accounts.privateKeyToAccount(private_key1);
                                if (!account) {
                                  console.log("inside account if 2")

                                  res.send({ fail: "true", success: "false" });
                                }
                              }

                              if (account.address != wallet_address) {
                                console.log("inside account if 3")

                                res.send({ fail: "true", success: "false" });
                              }
                              else {
                                console.log("inside account if 4")




                                const user = contractABI;

                                var contract = new web3.eth.Contract(user, contractAddress);
                                // var private_key1 = '0x97d17cf1e4852e681fd778aa95b046b6f47989fb63ede2e7348682d4e14af8e9'
                                var private_key = private_key1.slice(2);
                                var privateKey = Buffer.from(private_key, 'hex');

                                await web3.eth.getTransactionCount(wallet_address).then(async function (v) {
                                  console.log("***********v ", v)
                                  // if(k==0){
                                  //   count = v;
                                  // }else if(count==v){
                                  //   count = v+1;
                                  // }else{
                                  count = v;
                                  // }             

                                  console.log("*********count*********", count);


                                  var rawTransaction = {
                                    "from": wallet_address,
                                    "gasPrice": '0x0',
                                    "gasLimit": web3.utils.toHex(4600000),
                                    "to": contractAddress,
                                    "value": "0x0",
                                    "data": contract.methods.addDocument(doc, verifier_email, client_email, doc_name, verifier_myReflect_code, client_myReflect_code, request_status, reason).encodeABI(),
                                    "nonce": web3.utils.toHex(count)
                                  }

                                  console.log('rawTransaction : ', rawTransaction)
                                  var transaction = new Tx(rawTransaction);
                                  transaction.sign(privateKey);


                                  await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, tx_hash) => {
                                    console.log("err ", err);
                                    console.log("tx_hash ", tx_hash, " request_file_id : ", request_file_id);
                                    console.log("request_doc_id ", request_doc_id, " version : ", version);
                                    RequestFilesModel.update({ transaction_hash: tx_hash, docfile_status: "accept", reason: reason, updatedAt: moment(new Date()) }, { where: { request_doc_id: request_doc_id, version: version } }).then(success => {

                                      console.log('request_file_id : ', request_file_id, "  ^^^^^^^^^^^^ transaction_hash :", tx_hash)
                                      //  res.redirect('/pen_request_view_client_info?request_id='+request_id);
                                      senddata()
                                    }).catch(err => {
                                      console.log("**************err********* ", err);
                                    })

                                  })
                                })
                                // count++;
                              }

                            }





                          });

                        })
                        .catch(err => {
                          console.log('error', err);

                        });

                    });
                  })

                })

              }

              console.log("before await");



              console.log("After await");



            })

          })

        })
        k++;
      })
      /*outer loop End*/

      // setTimeout(senddata,20000);
      function senddata() {
        msg = `Your ${document_name} has been verified by ${ver_name}-${V_R_code}`;
        NotificationModel.create({
          notification_msg: msg,
          sender_id: user_id,
          receiver_id: client_id,
          request_id: request_id,
          notification_type: 1,
          notification_date: formatted,
          read_status: "no"
        }).then(data => {
          console.log("inside 3red")

          res.send({ fail: "false", success: "true" });
        }).catch(err => console.log("err1", err))

      }

    })
  })
}

/**accept-request Post method End**/

/**reject-request Post method Start**/
exports.reject_request = async (req, res, next) => {

  var request_id = req.body.request_id;
  var blob_url = req.body.blob_url;

  var private_key2 = req.body.private_key.trim();
  var private_key1;
  // var request_file_id = req.body.request_file_id;
  var msg;
  var document_name;
  let user_id = req.session.user_id;
  console.log("user_id", user_id);
  var client_id;
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');
  var V_R_code;
  var ver_name;

  var ver_reflect_id = req.body.ver_reflect_id;
  var client_reflect_id = req.body.client_reflect_id;
  console.log("ver_reflect_id------ ", ver_reflect_id);
  var request_status = 'rejected';
  var reason = req.body.reason;
  var request_doc_id = req.body.request_doc_id;
  await RequestDocumentsModel.update({ approve_status: "rejected" }, { where: { request_doc_id: request_doc_id } }).then(async update_success => {

    await db.query("SELECT * FROM tbl_request_documents_files INNER JOIN tbl_request_documents ON tbl_request_documents_files.request_doc_id=tbl_request_documents.request_doc_id INNER JOIN tbl_myreflectid_doc_rels ON tbl_request_documents.user_doc_id=tbl_myreflectid_doc_rels.user_doc_id INNER JOIN tbl_documents_masters ON tbl_myreflectid_doc_rels.doc_id=tbl_documents_masters.doc_id where tbl_request_documents_files.docfile_status='pending' AND tbl_request_documents_files.request_doc_id=" + request_doc_id, { type: db.QueryTypes.SELECT }).then(async request_doc_data => {
      let count = 0;
      /*outer loop Start*/

      // for(var k=0;k<request_doc_data.length;k++){
      var k = 0;
      var array_of_doc_hash = []
      var string_array_of_doc_hash
      async.each(request_doc_data, async function (content, cb) {


        console.log("*****request_doc_data****** ", content);

        var self_assested = content.self_assested

        var doc = content.request_file_hash;
        var doc_name = content.document_name;
        document_name = content.document_name;
        var request_file_id = content.request_file_id;
        var request_doc_id = content.request_doc_id
        var version = content.version

        //  await db.query("SELECT * FROM tbl_files_docs INNER JOIN tbl_myreflectid_doc_rels ON tbl_files_docs.user_doc_id=tbl_myreflectid_doc_rels.user_doc_id inner join tbl_documents_masters on tbl_documents_masters.doc_id=tbl_myreflectid_doc_rels.doc_id WHERE tbl_files_docs.file_id="+file_id,{ type:db.QueryTypes.SELECT}).then(async function(file_result){
        //     var doc = file_result[0].file_content;
        //     var doc_name = file_result[0].document_name;
        //     // console.log("file_result----------********------ ",file_result);
        //     var user_reflect_id = file_result[0].reflect_id;
        await db.query("SELECT * FROM tbl_wallet_reflectid_rels INNER JOIN tbl_user_registrations ON tbl_wallet_reflectid_rels.reg_user_id=tbl_user_registrations.reg_user_id WHERE tbl_wallet_reflectid_rels.deleted='0' AND tbl_wallet_reflectid_rels.reflect_id=" + client_reflect_id, { type: db.QueryTypes.SELECT }).then(async function (client_data) {
          // console.log("client_data----------********------ ",client_data);
          client_id = client_data[0].reg_user_id;
          var client_email = decrypt(client_data[0].email);
          var client_myReflect_code = client_data[0].reflect_code;

          await db.query("SELECT * FROM tbl_wallet_reflectid_rels INNER JOIN tbl_user_registrations ON tbl_wallet_reflectid_rels.reg_user_id=tbl_user_registrations.reg_user_id WHERE tbl_wallet_reflectid_rels.deleted='0' AND tbl_wallet_reflectid_rels.reflect_id=" + ver_reflect_id, { type: db.QueryTypes.SELECT }).then(async function (verifier_data) {
            // console.log("verifier_data----------********------ ",verifier_data);
            var verifier_email = decrypt(verifier_data[0].email);
            var verifier_myReflect_code = verifier_data[0].reflect_code;
            var wallet_id = verifier_data[0].wallet_id;
            V_R_code = verifier_data[0].reflect_code;
            ver_name = decrypt(verifier_data[0].full_name);


            var verifier_name;

            if (verifier_data[0].entity_company_name) {
              verifier_name = verifier_data[0].entity_company_name;
            }
            else if (verifier_data[0].rep_firstname) {
              verifier_name = verifier_data[0].rep_firstname;

            }
            else {
              verifier_name = verifier_data[0].full_name;

            }
            await db.query("SELECT * FROM tbl_user_wallets WHERE deleted='0' AND wallet_id=" + wallet_id, { type: db.QueryTypes.SELECT }).then(async function (wallet_data) {
              // console.log("wallet_data----------********------ ",wallet_data);




              const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration))

              var jimp_doc, srcImage, ipfs_width, ipfs_height;
              console.log("before await 1", self_assested);
              console.log("Doc-----2------ ", doc);

              console.log("detail-----2------ ", doc, verifier_name, V_R_code);




              async function wait_hash() {

                //  if (self_assested==='yes') {

                await request(`https://ipfs.io/ipfs/${doc}`, async function (error, response, body) {

                  if (!error && response.statusCode == 200) {

                    srcImage = dataUriToBuffer(body);
                  }


                })
                await delay(10000)


                // }
                //  else
                //  {

                //                     srcImage = `https://ipfs.io/ipfs/${doc}`

                //                      console.log("elseSSSSSSSSSSSSSSSSShello-----------1 ",srcImage);

                //  }  
              }



              if (content.doc_type == "image") {

                await wait_hash();
                await jimp_fun();

              } else if (content.doc_type == "pdf") {

                console.log(" content.doc_type : ", content.doc_type)

                console.log(" content.doc_type DOCCCCCCC : ", doc)

                const run = async (OldHash) => {

                  let promins = new Promise(async (resolve, reject) => {
                    console.log("hello 0")

                    const url = `https://ipfs.io/ipfs/${OldHash}`

                    const pdf1 = await fetch(url).then(res => res.arrayBuffer())
                    console.log("pdf1 : ", pdf1)
                    resolve(pdf1)


                  })

                  await promins.then(async pdf1 => {




                    const pdfDoc = await PDFDocument.load(pdf1);


                    // const approve_img_icon = await pdfDoc.embedPng(fs.readFileSync(__dirname+'/../../public/assets/images/approve.jpg'));
                    const approve_img_icon = await pdfDoc.embedPng(fs.readFileSync(__dirname + '/../../public/assets/images/rejected.png'));

                    console.log("hello 2")


                    console.log("hello 3")


                    const pages = pdfDoc.getPages();
                    const imagePage = pages[0];

                    console.log("hello 4")

                    let message_date = moment(new Date()).format("ddd,MM-D-YYYY")
                    let message_time = moment(new Date()).format("h:mm:ssa")
                    var segImeg = blob_url.split(',')[1];

                    const buff = Buffer.from(segImeg, 'base64');
                    buff.toString();

                    const sign_img = await pdfDoc.embedPng(buff);

                    let date_time = message_date + " " + message_time
                    let ver_text = verifier_name + '-' + V_R_code

                    imagePage.drawText(date_time, { x: 450, y: 95, size: 8 })
                    imagePage.drawText(ver_text, { x: 450, y: 105, size: 10 })

                    // console.log("hello 5 ",imagePage.getWidth()," height : ",imagePage.getHeight())


                    // console.log("hello 5 ",imagePage.getWidth()/9," height : ",imagePage.getHeight()/9)


                    imagePage.drawImage(sign_img, {
                      x: 450,
                      y: 110,
                      width: imagePage.getWidth() / 5,
                      height: imagePage.getHeight() / 5
                    });
                    imagePage.drawImage(approve_img_icon, {
                      x: 450,
                      y: 700,
                      width: imagePage.getWidth() / 8,
                      height: imagePage.getHeight() / 8
                    });
                    console.log("hello 6")

                    const pdfBytes = await pdfDoc.save();
                    console.log("hello 7")


                    let testBuffer = new Buffer(pdfBytes);

                    console.log(" pathToImage ", testBuffer)
                    console.log("hello 8")

                    await ipfs.files.add(testBuffer, async function (err, file) {
                      if (err) {
                        //  console.log("err from ejs",err);
                      }

                      console.log("from ipfs self_attested_hash:file[0].hash text_img", file[0].hash);
                      array_of_doc_hash.push(content.doc_type + '-' + file[0].hash)


                      if (array_of_doc_hash.length == request_doc_data.length) {
                        console.log("inside render if")

                        string_array_of_doc_hash = array_of_doc_hash.toString()
                        await TransactionFunction(string_array_of_doc_hash)

                        async function TransactionFunction(string_array_of_doc_hash) {


                          console.log("from ipfs self_attested_hash:file[0].hash text_img", string_array_of_doc_hash);

                          // jimp_doc = file[0].hash;
                          jimp_doc = string_array_of_doc_hash;


                          console.log("jimp_doc ejs", doc);


                          var doc = jimp_doc

                          var doc = jimp_doc
                          console.log("ALLLLLLLLLLLLLLLLLLLLLLLLLL %$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BLOCKCHAIN DATAAAAAAAAAAAAAAAAA");

                          console.log("doc ejs", doc);

                          var wallet_address = wallet_data[0].wallet_address;
                          //  var wallet_address='0x39c40B81acC1F06f3BDEb3A4fE36A8De9753313B';
                          let account;
                          var m = private_key2.indexOf("0x");
                          if (m == 0) {
                            private_key1 = private_key2
                            account = web3.eth.accounts.privateKeyToAccount(private_key1);
                            if (!account) {
                              res.send({ fail: "true", success: "false" });
                            }
                          } else {
                            private_key1 = '0x' + private_key2;
                            console.log("*************private_key1 ", private_key1);
                            account = web3.eth.accounts.privateKeyToAccount(private_key1);
                            if (!account) {
                              res.send({ fail: "true", success: "false" });
                            }
                          }

                          if (account.address != wallet_address) {
                            res.send({ fail: "true", success: "false" });
                          }
                          else {

                            // var contractABI = contractABI;

                            const user = contractABI;
                            // var contractAddress = contractAddress;
                            var contract = new web3.eth.Contract(user, contractAddress);
                            // var private_key1 = '0x97d17cf1e4852e681fd778aa95b046b6f47989fb63ede2e7348682d4e14af8e9'
                            var private_key = private_key1.slice(2);
                            var privateKey = Buffer.from(private_key, 'hex');

                            await web3.eth.getTransactionCount(wallet_address).then(async function (v) {
                              console.log("***********v ", v)
                              if (k == 0) {
                                count = v;
                              } else if (count == v) {
                                count = v + 1;
                              } else {
                                count = v;
                              }

                              console.log("*********count*********", count);


                              var rawTransaction = {
                                "from": wallet_address,
                                "gasPrice": '0x0',
                                "gasLimit": web3.utils.toHex(4600000),
                                "to": contractAddress,
                                "value": "0x0",
                                "data": contract.methods.addDocument(doc, verifier_email, client_email, doc_name, verifier_myReflect_code, client_myReflect_code, request_status, reason).encodeABI(),
                                "nonce": web3.utils.toHex(count)
                              }


                              var transaction = new Tx(rawTransaction);
                              transaction.sign(privateKey);


                              await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, tx_hash) => {
                                console.log("err ", err);
                                console.log("tx_hash ", tx_hash);
                                RequestFilesModel.update({ transaction_hash: tx_hash, docfile_status: "reject", reason: reason, updatedAt: moment(new Date()) }, { where: { request_doc_id: request_doc_id, version: version } }).then(success => {
                                  //  res.redirect('/pen_request_view_client_info?request_id='+request_id);

                                }).catch(err => {
                                  console.log("**************err********* ", err);
                                })

                              })
                            })
                            // count++;
                          }



                        }


                      }
                    })
                  })

                }
                await run(doc);

              } else {
                // array_of_doc_hash.push({doc_type:content.doc_type,hase:doc})
                array_of_doc_hash.push(content.doc_type + '-' + doc)

                if (array_of_doc_hash.length == request_doc_data.length) {
                  console.log("inside render if")
                  string_array_of_doc_hash = array_of_doc_hash.toString()
                  await TransactionFunction(string_array_of_doc_hash)

                }
                async function TransactionFunction(string_array_of_doc_hash) {


                  console.log("from ipfs self_attested_hash:file[0].hash text_img", string_array_of_doc_hash);

                  // jimp_doc = file[0].hash;
                  jimp_doc = string_array_of_doc_hash;


                  console.log("jimp_doc ejs", doc);


                  var doc = jimp_doc

                  var doc = jimp_doc
                  console.log("ALLLLLLLLLLLLLLLLLLLLLLLLLL %$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BLOCKCHAIN DATAAAAAAAAAAAAAAAAA");

                  console.log("doc ejs", doc);

                  var wallet_address = wallet_data[0].wallet_address;
                  //  var wallet_address='0x39c40B81acC1F06f3BDEb3A4fE36A8De9753313B';
                  let account;
                  var m = private_key2.indexOf("0x");
                  if (m == 0) {
                    private_key1 = private_key2
                    account = web3.eth.accounts.privateKeyToAccount(private_key1);
                    if (!account) {
                      res.send({ fail: "true", success: "false" });
                    }
                  } else {
                    private_key1 = '0x' + private_key2;
                    console.log("*************private_key1 ", private_key1);
                    account = web3.eth.accounts.privateKeyToAccount(private_key1);
                    if (!account) {
                      res.send({ fail: "true", success: "false" });
                    }
                  }

                  if (account.address != wallet_address) {
                    res.send({ fail: "true", success: "false" });
                  }
                  else {

                    // var contractABI = contractABI;

                    const user = contractABI;
                    // var contractAddress = contractAddress;
                    var contract = new web3.eth.Contract(user, contractAddress);
                    // var private_key1 = '0x97d17cf1e4852e681fd778aa95b046b6f47989fb63ede2e7348682d4e14af8e9'
                    var private_key = private_key1.slice(2);
                    var privateKey = Buffer.from(private_key, 'hex');

                    await web3.eth.getTransactionCount(wallet_address).then(async function (v) {
                      console.log("***********v ", v)
                      if (k == 0) {
                        count = v;
                      } else if (count == v) {
                        count = v + 1;
                      } else {
                        count = v;
                      }

                      console.log("*********count*********", count);


                      var rawTransaction = {
                        "from": wallet_address,
                        "gasPrice": '0x0',
                        "gasLimit": web3.utils.toHex(4600000),
                        "to": contractAddress,
                        "value": "0x0",
                        "data": contract.methods.addDocument(doc, verifier_email, client_email, doc_name, verifier_myReflect_code, client_myReflect_code, request_status, reason).encodeABI(),
                        "nonce": web3.utils.toHex(count)
                      }


                      var transaction = new Tx(rawTransaction);
                      transaction.sign(privateKey);


                      await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, tx_hash) => {
                        console.log("err ", err);
                        console.log("tx_hash ", tx_hash);
                        RequestFilesModel.update({ transaction_hash: tx_hash, docfile_status: "reject", reason: reason, updatedAt: moment(new Date()) }, { where: { request_doc_id: request_doc_id, version: version } }).then(success => {
                          //  res.redirect('/pen_request_view_client_info?request_id='+request_id);

                        }).catch(err => {
                          console.log("**************err********* ", err);
                        })

                      })
                    })
                    // count++;
                  }



                }

              }

              //  console.log("before await1");
              //      await wait_hash();

              console.log("After await1");
              async function jimp_fun() {

                // let message_date = moment(new Date()).format("h:mm:ssa,ddd,MM-D-YYYY")
                let message_date = moment(new Date()).format("ddd,MM-D-YYYY")
                let message_time = moment(new Date()).format("h:mm:ssa")
                var segImeg = blob_url.split(',')[1];

                const buff = Buffer.from(segImeg, 'base64');
                buff.toString();


                await Jimp.read(buff).then(async newimage => {





                  await Jimp.read(srcImage).then(async image => {
                    await newimage.resize(image.bitmap.width / 4, image.bitmap.width / 4);
                    console.log(newimage.bitmap)
                    let rejected_image = await Jimp.read(__dirname + '/../../public/assets/images/rejected.jpg')
                    await rejected_image.resize(image.bitmap.width / 4, image.bitmap.width / 4);
                    await Jimp.create(image.bitmap.width, ((image.bitmap.height) + ((image.bitmap.width / 4) + 30)), '#ffffff').then(async nova_new => {

                      console.log("hello-----------3 3  ");


                      Jimp.loadFont(Jimp.FONT_SANS_12_BLACK)
                        .then(async font => {

                          nova_new.print(
                            font,
                            (image.bitmap.width) - (image.bitmap.width / 4),
                            image.bitmap.height + 10,
                            verifier_name + '-' + V_R_code,
                            5,
                            (err, nova_new, { x, y }) => {
                              nova_new.print(font, x, y, message_date, 5,
                                (err, nova_new, { x, y }) => {
                                  nova_new.print(font, x, y, message_time, 5,);
                                });
                            }
                          );

                          //  text_name_code.print(font, x,y,   verifier_name)


                          //  text_date.print(font, x, y + 20,message_date  , 50);


                          console.log("hello-----------3 4  ");
                          nova_new.composite(image, 0, 0)
                          nova_new.composite(newimage, (image.bitmap.width) - (image.bitmap.width / 4), image.bitmap.height);
                          nova_new.composite(rejected_image, 0, image.bitmap.height);

                          // nova_new.composite(image,0,text_height)
                          // nova_new.composite(newimage,0,0);


                          console.log("hello-----------55   ");


                          let text_img = nova_new.getBase64Async(Jimp.MIME_PNG);

                          console.log("hello-----------3 ");

                          text_img.then(result => {

                            let testBuffer = new Buffer(result);

                            ipfs.files.add(testBuffer, async function (err, file) {

                              console.log("from ipfs ", file);

                              if (err) {



                              } else {

                                array_of_doc_hash.push({ doc_type: content.doc_type, hase: file[0].hash })

                                if (array_of_doc_hash.length == request_doc_data.length) {

                                  string_array_of_doc_hash = array_of_doc_hash.toString()
                                  await TransactionFunction(string_array_of_doc_hash)

                                }

                              }

                              await delay(10000)


                            })
                            async function TransactionFunction(string_array_of_doc_hash) {


                              console.log("from ipfs self_attested_hash:file[0].hash text_img", string_array_of_doc_hash);

                              // jimp_doc = file[0].hash;
                              jimp_doc = string_array_of_doc_hash;


                              console.log("jimp_doc ejs", doc);


                              var doc = jimp_doc

                              var doc = jimp_doc
                              console.log("ALLLLLLLLLLLLLLLLLLLLLLLLLL %$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BLOCKCHAIN DATAAAAAAAAAAAAAAAAA");

                              console.log("doc ejs", doc);

                              var wallet_address = wallet_data[0].wallet_address;
                              //  var wallet_address='0x39c40B81acC1F06f3BDEb3A4fE36A8De9753313B';
                              let account;
                              var m = private_key2.indexOf("0x");
                              if (m == 0) {
                                private_key1 = private_key2
                                account = web3.eth.accounts.privateKeyToAccount(private_key1);
                                if (!account) {
                                  res.send({ fail: "true", success: "false" });
                                }
                              } else {
                                private_key1 = '0x' + private_key2;
                                console.log("*************private_key1 ", private_key1);
                                account = web3.eth.accounts.privateKeyToAccount(private_key1);
                                if (!account) {
                                  res.send({ fail: "true", success: "false" });
                                }
                              }

                              if (account.address != wallet_address) {
                                res.send({ fail: "true", success: "false" });
                              }
                              else {

                                // var contractABI = contractABI;

                                const user = contractABI;
                                // var contractAddress = contractAddress;
                                var contract = new web3.eth.Contract(user, contractAddress);
                                // var private_key1 = '0x97d17cf1e4852e681fd778aa95b046b6f47989fb63ede2e7348682d4e14af8e9'
                                var private_key = private_key1.slice(2);
                                var privateKey = Buffer.from(private_key, 'hex');

                                await web3.eth.getTransactionCount(wallet_address).then(async function (v) {
                                  console.log("***********v ", v)
                                  if (k == 0) {
                                    count = v;
                                  } else if (count == v) {
                                    count = v + 1;
                                  } else {
                                    count = v;
                                  }

                                  console.log("*********count*********", count);


                                  var rawTransaction = {
                                    "from": wallet_address,
                                    "gasPrice": '0x0',
                                    "gasLimit": web3.utils.toHex(4600000),
                                    "to": contractAddress,
                                    "value": "0x0",
                                    "data": contract.methods.addDocument(doc, verifier_email, client_email, doc_name, verifier_myReflect_code, client_myReflect_code, request_status, reason).encodeABI(),
                                    "nonce": web3.utils.toHex(count)
                                  }


                                  var transaction = new Tx(rawTransaction);
                                  transaction.sign(privateKey);


                                  await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, tx_hash) => {
                                    console.log("err ", err);
                                    console.log("tx_hash ", tx_hash);
                                    RequestFilesModel.update({ transaction_hash: tx_hash, docfile_status: "reject", reason: reason, updatedAt: moment(new Date()) }, { where: { request_doc_id: request_doc_id, version: version } }).then(success => {
                                      //  res.redirect('/pen_request_view_client_info?request_id='+request_id);

                                    }).catch(err => {
                                      console.log("**************err********* ", err);
                                    })

                                  })
                                })
                                // count++;
                              }



                            }

                          });

                        })
                        .catch(err => {
                          console.log('error', err);

                        });

                    });
                  })

                })

              }

              console.log("before await");

              await jimp_fun();

              console.log("After await", jimp_doc);



            })

          })

        })
        k++;
      })
      /*outer loop End*/

      setTimeout(senddata, 20000);
      async function senddata() {
        msg = `Your ${document_name} has been rejected by ${ver_name}-${V_R_code}`;
        await NotificationModel.create({
          notification_msg: msg,
          sender_id: user_id,
          receiver_id: client_id,
          request_id: request_id,
          notification_type: 1,
          notification_date: formatted,
          read_status: "no"
        }).then(data => {
          console.log("inside 3red")

          res.send({ fail: "false", success: "true" });
        }).catch(err => console.log("err1", err))

      }
    })
  })
}
/**reject-request Post method End**/