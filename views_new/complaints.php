
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
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Save</button>
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
              <li>
                <a href="property.html"><img class="act-img" src="images/dreamhome-active.png"><img
                    src="images/dreamhome.png"> Properties</a>
              </li>
              <li class="active">
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

            <div class="row complaints-sec">
              <div class="col-sm-6 col-lg-6">
                <div class="complaints">
                  <h2>Complaints</h2>
                </div>
              </div>
              <div class="col-sm-6 col-lg-6">
                <div class="complaints float-right">
                  <a href="#" data-toggle="modal" data-target="#myModal" class="btn btn-complaint">
                    Raise a New Complaint</a>
                </div>
              </div>

            </div>

            <div class=" dashboard-inner">

              <table class="table table-responsive table-phase-fix">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Client Name</th>
                    <th class="message-th">Message</th>
                    <th>Property Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>C1234</p>
                    </td>
                    <td>Andrew Wills </td>
                    <td>Lorem ipsum dolor sit amet,</td>
                    <td>Nacary Apartment </td>
                    <td>16 Nov, 2020</td>
                    <td><a href="complaints-detail.html" class="btn btn-pending">PENDING</a></td>
                    <td> <a href="complaints-detail.html"><img src="images/eye.png"></a> </td>
                  </tr>
                  <tr>
                    <td>
                      <p>C1234 </p>

                    </td>
                    <td>Rachel Green </td>
                    <td>Lorem ipsum dolor sit amet,</td>
                    <td>Hilton Avenue </td>
                    <td>16 Nov, 2020</td>
                    <td><a href="complaints-detail.html" class="btn btn-complete">COMPLETED</a></td>
                    <td> <a href="complaints-detail.html"><img src="images/eye.png"></a> </td>
                  </tr>
                  <tr>
                    <td>
                      <p>C1234 </p>

                    </td>
                    <td>Jack Lee </td>
                    <td>Lorem ipsum dolor sit amet,</td>
                    <td>Princess Skyline</td>
                    <td>16 Nov, 2020 </td>
                    <td><a href="complaints-detail.html" class="btn btn-pending">PENDING</a></td>
                    <td> <a href="complaints-detail.html"><img src="images/eye.png"></a> </td>
                  </tr>
                  <tr>
                    <td>
                      <p>C1234 </p>

                    </td>
                    <td>Celia Ahern </td>
                    <td>Lorem ipsum dolor sit amet,</td>
                    <td>Princess Skyline </td>
                    <td>16 Nov, 2020 </td>
                    <td><a href="complaints-detail.html" class="btn btn-complete">COMPLETED</a>
                    </td>
                    <td> <a href="complaints-detail.html"><img src="images/eye.png"></a> </td>
                  </tr>

                  <tr>
                    <td>
                      <p>C1234 </p>

                    </td>
                    <td>Monica Geller</td>
                    <td>Lorem ipsum dolor sit amet,</td>
                    <td>Hilton Avenue</td>
                    <td>16 Nov, 2020 </td>
                    <td><a href="complaints-detail.html" class="btn btn-pending">PENDING</a></td>
                    <td> <a href="complaints-detail.html"><img src="images/eye.png"></a> </td>
                  </tr>
                  <tr>
                    <td>
                      <p>C1234 </p>

                    </td>
                    <td>Monica Geller</td>
                    <td>Lorem ipsum dolor sit amet,</td>
                    <td>Hilton Avenue</td>
                    <td>16 Nov, 2020 </td>
                    <td><a href="complaints-detail.html" class="btn btn-pending">PENDING</a></td>
                    <td> <a href="complaints-detail.html"><img src="images/eye.png"></a> </td>
                  </tr>
                </tbody>
              </table>


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