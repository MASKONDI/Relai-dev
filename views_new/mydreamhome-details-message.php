
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
            <div class="dashboard-inner">
              <div class="row">
                <div class="breadcumb">
                  <ul>
                    <li><a href="mydreamhome-details.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back
                        to Nacary
                        Apartment</a></li>
                  </ul>
                </div>
              </div>
              <div class="docs-files-section1 msg-sec">
                <div class="row">
                  <div class="col-sm-12 col-lg-12">
                    <div class="docs-files">
                      <h2>Messages</h2>
                    </div>
                    <div class="messages-section">
                      <div class="messages-box clearfix">
                        <div class="message-user-img">
                          <img src="images/recent-user-1.png" alt="" title="">
                        </div>
                        <div class="message-content">
                          <h3>Rachel Green</h3>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s,</p>
                          <p class="hours-ago text-right">13 hours ago</p>
                        </div>
                      </div>
                      <div class="messages-box clearfix">
                        <div class="message-user-img">
                          <img src="images/recent-user-1.png" alt="" title="">
                        </div>
                        <div class="message-content">
                          <h3>Rachel Green</h3>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s,</p>
                          <p class="hours-ago text-right">13 hours ago</p>
                        </div>
                      </div>
                      <div class="messages-box clearfix">
                        <div class="message-user-img">
                          <img src="images/recent-user-1.png" alt="" title="">
                        </div>
                        <div class="message-content">
                          <h3>Rachel Green</h3>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s,</p>
                          <p class="hours-ago text-right">13 hours ago</p>
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