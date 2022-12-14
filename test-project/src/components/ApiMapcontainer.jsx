import React, { useEffect, useState } from "react";
import { markerdata } from "../data/markerdata";
import "../css/ApiMapcontainer.css";
const { kakao } = window;

const ApiMapContainer = ({ searchPlace }) => {
  // 검색결과 배열에 담아줌
  const [Places, setPlaces] = useState([]);

  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    var markers = [];
    const container = document.getElementById("api-myMap");
    const options = {
      center: new kakao.maps.LatLng(37.55414414942706, 126.9339531816519),
      level: 8,
    };
    const map = new kakao.maps.Map(container, options);

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchPlace, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        map.setBounds(bounds);
        // 페이지 목록 보여주는 displayPagination() 추가
        displayPagination(pagination);
        setPlaces(data);
      }
    }

    // 검색결과 목록 하단에 페이지 번호 표시
    function displayPagination(pagination) {
      var paginationEl = document.getElementById("api-pagination"),
        fragment = document.createDocumentFragment(),
        i;

      // 기존에 추가된 페이지 번호 삭제
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement("a");
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.open(map, marker);
      });
    }

    markerdata.forEach(el => {
      // 마커를 생성합니다
      new kakao.maps.Marker({
        //마커가 표시 될 지도
        map: map,
        //마커가 표시 될 위치
        position: new kakao.maps.LatLng(el.lat, el.lng),
        //마커에 hover시 나타날 title
        title: el.title,
      });
    });
  }, [searchPlace]);

  return (
    <div id="api-TopMap">
      <div id="api-myMap"></div>
      <div id="api-midMap">
        <li
          style={{
            listStyle: "none",
          }}
        >
          <div id="api-result-list-body">
            <div id="api-result-list">
              {Places.map((item, i) => (
                <div key={i}>
                  <span>{i + 1}</span>
                  <div>
                    <h5>{item.place_name}</h5>
                    {item.road_address_name ? (
                      <div>
                        <span>도로명 : {item.road_address_name}</span>
                        <br />
                        <span>지번 : {item.address_name}</span>
                      </div>
                    ) : (
                      <span>
                        지번 : {item.address_name}
                        <br />
                      </span>
                    )}
                    <span>
                      {item.phone ? (
                        <span>연락처: {item.phone}</span>
                      ) : (
                        <span></span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
              <div id="api-pagination"></div>
            </div>
          </div>
        </li>
      </div>
    </div>
  );
};

export default ApiMapContainer;
