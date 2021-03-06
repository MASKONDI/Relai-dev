
    <!-- The Modal -->
  <div class="modal permission-modal fade " id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header text-center">
          <h2 class="modal-title w-100">Raise a Complaint</h2>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <select class="form-control " id="selectBox">
            <option value="0">Select professional</option>
            <option value="">2</option>
          </select>

          <input type="text" class="form-control  form-control-fix2" id="subject" placeholder="Subject" name="subject">
          <textarea class="form-control  form-control-fix2" rows="3" id="comment">Add Notes</textarea>

          <div class="model-btn-fix">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Submit</button>
        </div>
      </div>
    </div>
  </div>
    <div class="dashboard-wpr">
      <div class="container-fluid">
        <div class="row content">
          <div class="col-sm-2 sidenav hidden-xs-down">
            <div class="user-login text-center">
              <div class="user-profile">
                <img src="images/user-3.png" alt="" title="">
              </div>
              <div class="user-name">
                <h6>John Doe,<span><i>
                      Architect</i>
                  </span></h6>

                <a href="#"><i>johndoe12@gmail.com</i></a>
              </div>
            </div>
            <ul class="dashboard-nav">
              <li>
                <a href="dashboard-professional.html"><img class="act-img" src="images/dashboard-active.png"><img
                    src="images/dashboard.png"> Dashboard</a>
              </li>
              <li>
                <a href="track-your-progress-professionals.html"><img class="act-img" src="images/track-active.png"><img
                    src="images/track.png"> Track your progress</a>
              </li>
              <li class="active">
                <a href="property.html"><img class="act-img" src="images/dreamhome-active.png"><img
                    src="images/dreamhome.png"> Properties</a>
              </li>
              <li>
                <a href="complaints.html"><img class="act-img" src="images/complaints-active.png"><img
                    src="images/complaints.png"> Complaints</a>
              </li>

              <li>
                <a href="professionals-to-do-list.html"><img class="act-img" src="images/to-do-list-active.png"><img
                    src="images/to-do-list.png"> To do list</a>
              </li>
            </ul>
          </div>
          <div class="col-sm-12 col-lg-10">
            <div class="dashboard-inner">
              <div class="row back-to-home">
                <div class="breadcumb">
                  <ul>
                    <li><a href="myproperties.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back to My
                        Properties</a></li>
                  </ul>
                </div>
              </div>
              <div class="docs-files-section">
                <div class="row">
                  <div class="col-sm-12 col-lg-12">
                    <div class="apartment-slider">
                      <div class="row">
                        <div class="col-sm-12 col-lg-5">
                          <div id="demo" class="carousel slide" data-ride="carousel">
                            <!-- The slideshow -->
                            <div class="carousel-inner">
                              <div class="carousel-item active">
                                <img src="images/nacary.png" alt="">
                              </div>
                              <div class="carousel-item">
                                <img src="images/nacary.png" alt="">
                              </div>
                              <div class="carousel-item">
                                <img src="images/nacary.png" alt="">
                              </div>
                            </div>
                            <!-- Left and right controls -->
                            <a class="carousel-control-prev" href="#demo" data-slide="prev">
                              <i class="fa fa-angle-left" aria-hidden="true"></i>
                            </a>
                            <a class="carousel-control-next" href="#demo" data-slide="next">
                              <i class="fa fa-angle-right" aria-hidden="true"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-sm-12 col-lg-7">
                          <div class="apartment-details">
                            <div class="clearfix">
                              <div class="float-left">
                                <h3 class="apartment-name"><a href="#"> Nacary Apartment</a></h3>
                                <div class="row">
                                  <div class="col-sm-12 col-lg-6">
                                    <div class="location-part"><a href="#"><img src="images/location.png">
                                        <span>Sudirman,
                                          Central
                                          Jakarta</span></a></div>
                                  </div>

                                  <div class="col-sm-12 col-lg-6 ">
                                    <div class="recent-img img-fix">
                                      <img src="images/user-1.png"><span>
                                        by Robin Janson
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="img-fix3 float-right">
                                <a href="professionals-detail-message.html"><img src="images/chat.png"></a>
                                <a href="#" data-toggle="modal" data-target="#myModal"><img src="images/help.png"></a>
                              </div>
                            </div>
                            <div class="recent-img">
                              <img src="images/recent-user-1.png"><img class="mr-10" src="images/recent-user-2.png"><img
                                class="mr-10" src="images/recent-user-3.png">

                            </div>
                            <div class="apartment-details-full">
                              <div class="row">
                                <div class="col-sm-12 col-lg-3">
                                  <div class="start-date">
                                    <p>Start date<br><b>5 Apr, 2019</b></p>
                                  </div>
                                </div>
                                <div class="col-sm-12 col-lg-3">
                                  <div class="start-date">
                                    <p>End date<br><b>1 Dec, 2021</b></p>
                                  </div>
                                </div>
                                <div class="col-sm-12 col-lg-3">
                                  <div class="start-date">
                                    <p>Area<br><b>2,400 sq.ft.</b></p>
                                  </div>
                                </div>
                                <div class="col-sm-12 col-lg-3">
                                  <div class="start-date">
                                    <p>Duration<br><b>2 year</b></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="linear-arrow-sec">
                <div class="row">
                  <div class="col-md-9">
                    <div class="progress-line">
                      <ul>
                        <li class="progress-1"><a href="myproperties-detail-phaseA.html"><img
                              src="images/white-prgress=arrow.png"></a> <span>Phase A</span></li>
                        <li class="progress-2"><img src="images/white-prgress=arrow.png"> <span>Phase B</span></li>
                        <li class="progress-3"><img src="images/white-prgress=arrow.png"> <span>Phase C</span></li>
                        <li class="progress-4"><img src="images/white-prgress=arrow.png"> <span>Phase D</span></li>
                        <li class="progress-5"><img src="images/white-prgress=arrow.png"> <span>Phase E</span></li>
                        <li class="progress-6"><img src="images/white-prgress=arrow.png"> <span>Phase F</span></li>
                      </ul>
                    </div>
                    <div class="time-schedule2">
                      <ul>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            2 weeks
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            2 weeks
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            2 weeks
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            2 weeks
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            2 weeks
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            2 weeks
                          </div>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            5,000 $
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            5,000 $
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            5,000 $
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            5,000 $
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            5,000 $
                          </div>
                        </li>
                        <li>
                          <div>
                            <img src="images/track-active.png">
                            5,000 $
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="col">
                      <div class="time-cost-sec common-box-shadow">
                        <h6>TOTAL TIME</h6>
                        <h6 style="color:#005377; font-weight: bold;"> 525 days</h6>
                      </div>
                      <div class="time-cost-sec common-box-shadow">
                        <h6>TOTAL COST</h6>
                        <h6 style="color: #005377; font-weight: bold;"> 10000 $</h6>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div class="do-list-docs-message">
                <div class="row">
                  <div class="col-sm-12 col-lg-4">
                    <div class="do-list-sec">
                      <div class="do-list-header">
                        <a href="mydreamhome-details-to-dos.html">
                          <h3 class="text-center">To-do list</h3>
                        </a>
                      </div>
                      <label class="check-todos">
                        <p>Instruct solicitor <a href="mydreamhome-details-to-dos.html"><img
                              src="images/recent-user-1.png"></a>Michael Williams</p>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                      </label>
                      <label class="check-todos">
                        <p>Instruct other professionals<a href="mydreamhome-details-to-dos.html"><img
                              src="images/recent-user-1.png"></a>Michael Williams</p>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                      </label>
                      <label class="check-todos">
                        <p>ID/Passport</p>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                      </label>
                      <label class="check-todos">
                        <p>Proof of address</p>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                      </label>
                      <label class="check-todos">
                        <p>Proof of fund (cash buyers)/agreement in principle (mortgage)</p>
                        <input type="checkbox">
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div class="col-sm-12 col-lg-4">
                    <div class="do-list-sec">

                      <div class="do-list-header">
                        <a href="mydreamhome-details-docs.html">
                          <h3 class="text-center">Docs & Files</h3>
                        </a>
                      </div>
                      <ul class="docs-list">
                        <li><a href="mydreamhome-details-docs.html"><img src="images/idproof.png" alt=""
                              title=""><br><span>idproof.jpg</span></a>
                        </li>
                        <li><a href="mydreamhome-details-docs.html"><img src="images/pdf.png" alt=""
                              title=""><br><span>contract.pdf</span></a></li>
                      </ul>

                      <ul class="docs-list">
                        <li><a href="mydreamhome-details-docs.html"><img src="images/pdf.png" alt=""
                              title=""><br><span>contract.pdf</span></a></li>
                      </ul>

                    </div>
                  </div>
                  <div class="col-sm-12 col-lg-4">
                    <div class="do-list-sec">
                      <div class="do-list-header">
                        <a href="mydreamhome-details-message.html">
                          <h3 class="text-center">Messages</h3>
                        </a>
                      </div>
                      <div class="messages-list clearfix">
                        <div class="message-img float-left">
                          <a href="mydreamhome-details-message.html"><img src="images/recent-user-1.png" alt=""
                              title=""></a>
                        </div>
                        <div class="message-drop float-left">
                          <h3>Rachel Green</h3>
                          <p>Hi, Here are the documents.</p>
                        </div>
                      </div>
                      <div class="messages-list clearfix">
                        <div class="message-img float-left">
                          <a href="mydreamhome-details-message.html"> <img src="images/recent-user-1.png" alt=""
                              title=""></a>
                        </div>
                        <div class="message-drop float-left">
                          <h3>Rachel Green</h3>
                          <p>Hi, Here are the documents.</p>
                        </div>
                      </div>
                      <div class="messages-list clearfix">
                        <div class="message-img float-left">
                          <a href="mydreamhome-details-message.html"> <img src="images/recent-user-1.png" alt=""
                              title=""></a>
                        </div>
                        <div class="message-drop float-left">
                          <h3>Rachel Green</h3>
                          <p>Hi, Here are the documents.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
    integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
    integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
    crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
    integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
    crossorigin="anonymous"></script>
  <script>
    $(document).ready(function () {
      $(".sidenav ul li").click(function () {
        $(".sidenav ul li").removeClass("active");
        $(this).addClass("active");
      });
    });
    $(document).ready(function () {
      $(".right-navbar li").click(function () {
        $("right-navbar li").removeClass("active");
        $(this).addClass("active");
      });
    });
  </script>
</body>

</html>