
    <div class="dashboard-wpr">
      <div class="container-fluid">
        <div class="row content">
          <div class="col-sm-2 sidenav hidden-xs-down">
            <div class="user-login text-center">
              <div class="user-profile">
                <img src="images/profile.png" alt="" title="">
              </div>
              <div class="user-name">
                <h2>Andrew Wills</h2>
                <a href="#">andrewwills@gmail.com</a>
              </div>
            </div>
            <ul class="dashboard-nav">
              <li>
                <a href="dashboard.html"><img class="act-img" src="images/dashboard-active.png"><img
                    src="images/dashboard.png"> Dashboard</a>
              </li>
              <li>
                <a href="track-your-progress.html"><img class="act-img" src="images/track-active.png"><img
                    src="images/track.png"> Track your progress</a>
              </li>
              <li>
                <a href="professionals.html"><img class="act-img" src="images/professionals-active.png"><img
                    src="images/professionals.png"> Professionals</a>
              </li>
              <li class="active">
                <a href="mydreamhome-details-docs.html"><img class="act-img" src="images/dreamhome-active.png"><img
                    src="images/dreamhome.png"> My dream home</a>
              </li>
              <li>
                <a href="mydreamhome-details-to-dos.html"><img class="act-img" src="images/to-do-list-active.png"><img
                    src="images/to-do-list.png"> To do list</a>
              </li>
            </ul>
          </div>
          <div class="col-sm-12 col-lg-10">
            <div class="property-inner">
              <div class="row ">
                <div class="col-sm-12 col-lg-8">
                  <div class="breadcumb">
                    <ul>
                      <li><a href="mydreamhome.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i>
                          Back
                          to My Dream Home</a></li>
                    </ul>
                    <h2>Add Property</h2>
                  </div>
                </div>
              </div>
            </div>

            <div class="dashboard-inner">
              <form class="form" action="#">
                <div class="property-form">
                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <p>STEP 1</p>
                      <h6>Add property name & address</h6>
                    </div>
                  </div>
                  <div class="input-field">
                    <div class="row">
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="propertyname"
                          placeholder="Hilton Avenue Flat" name="propertyname"></div>
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="address" placeholder="Enter address"
                          name="address"></div>
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="city" placeholder="City" name="city">
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="state" placeholder="State"
                          name="state"></div>
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="country" placeholder="Country"
                          name="address"></div>
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="zipcode" placeholder="Zip code"
                          name="zipcode"></div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <p>STEP 2</p>
                      <h6>Add other party</h6>
                    </div>
                  </div>
                  <div class="input-field">
                    <div class="row">
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="buyer"
                          placeholder="buyer/seller/renovator" name="buyer"></div>
                      <div class="col-sm-12 col-lg-4"><input type="email"
                          class="form-control property-form-control-size-fix " id="emailaddress"
                          placeholder="Enter email address" name="email"></div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <p>STEP 3</p>
                      <h6>Add property details</h6>
                    </div>
                  </div>
                  <div class="input-field">
                    <div class="row">
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="area" placeholder="Area(sq. ft.)"
                          name="area"></div>
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="bedroom" placeholder="Bedroom"
                          name="bedroom1"></div>
                      <div class="col-sm-12 col-lg-4"><input type="text"
                          class="form-control property-form-control-size-fix " id="bedroom2" placeholder="Bedroom"
                          name="bedroom2"></div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 col-lg-12">
                        <textarea type="text" style=" width:95%" class="form-control property-form-control-size-fix "
                          id="address" name="notes">Additional notes(if any)</textarea>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <p>STEP 4</p>
                      <h6>Add property pictures</h6>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <div class="property-box">

                        <div class=property-inner-section>
                          <img src="images/upload-icon.png">
                        </div>
                        <div class="driving-liences-portfolio">
                          <p>Picture 1</p>
                        </div>
                        <div class="property-upload">
                          <a href="#">Upload</a>
                        </div>
                        <span>
                          <div class="custom-file-input">
                            <input type="file">
                            <input type="button">
                          </div>
                        </span>
                      </div>


                      <div class="property-box">

                        <div class=property-inner-section>
                          <img src="images/upload-icon.png">
                        </div>
                        <div class="driving-liences-portfolio">
                          <p>Picture 2</p>
                        </div>
                        <div class="property-upload">
                          <a href="#">Upload</a>
                        </div>
                        <span>
                          <div class="custom-file-input">
                            <input type="file">
                            <input type="button">
                          </div>
                        </span>
                      </div>


                      <div class="property-box">

                        <div class=property-inner-section>
                          <img src="images/upload-icon.png">
                        </div>
                        <div class="driving-liences-portfolio">
                          <p>Picture 3</p>
                        </div>
                        <div class="property-upload">
                          <a href="#">Upload</a>
                        </div>
                        <span>
                          <div class="custom-file-input">
                            <input type="file">
                            <input type="button">
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <p>STEP 5</p>
                      <h6>Add plan pictures</h6>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <div class="property-box">

                        <div class=property-inner-section>
                          <img src="images/upload-icon.png">
                        </div>
                        <div class="driving-liences-portfolio">
                          <p>Picture 1</p>
                        </div>
                        <div class="property-upload">
                          <a href="#">Upload</a>
                        </div>
                        <span>
                          <div class="custom-file-input">
                            <input type="file">
                            <input type="button">
                          </div>
                        </span>
                      </div>

                      <div class="property-box">

                        <div class=property-inner-section>
                          <img src="images/upload-icon.png">
                        </div>
                        <div class="driving-liences-portfolio">
                          <p>Picture 2</p>
                        </div>
                        <div class="property-upload">
                          <a href="#">Upload</a>
                        </div>
                        <span>
                          <div class="custom-file-input">
                            <input type="file">
                            <input type="button">
                          </div>
                        </span>
                      </div>

                      <div class="property-box">

                        <div class=property-inner-section>
                          <img src="images/upload-icon.png">
                        </div>
                        <div class="driving-liences-portfolio">
                          <p>Picture 3</p>
                        </div>
                        <div class="property-upload">
                          <a href="#">Upload</a>
                        </div>
                        <span>
                          <div class="custom-file-input">
                            <input type="file">
                            <input type="button">
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 col-lg-12">
                      <div class="property-btn">
                        <button type="submit" class="btn submit-btn">Add
                          Property</button>
                      </div>


                    </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src=" https://code.jquery.com/jquery-3.2.1.slim.min.js"
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