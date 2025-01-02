document.addEventListener("DOMContentLoaded", function() {
    const navbar = `
        <nav class="navbar">
            <div class="logo"><a href="index.html">KISADAN</a></div>
            <ul class="nav-menu">
                <li><a href="#intro">기사단소개</a></li>
                <li class="dropdown">
                    <a href="#members">구성원</a>
                    <ul class="dropdown-content">
                        <li><a href="#member1">이자현 대표</a></li>
                        <li><a href="#member2">백종일 단장</a></li>
                        <li><a href="#member3">여재호 단장</a></li>
                        <li><a href="#member4">이동호 단장</a></li>
                        <li><a href="#member5">임충일 단장</a></li>
                        <li><a href="#member6">최여원 단장</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#services">업무영역</a>
                    <ul class="dropdown-content">
                        <li><a href="service1.html">사업 아이템 개발 및 시장 검증 지원단</a></li>
                        <li><a href="service2.html">컨설팅 지원단</a></li>
                        <li><a href="service3.html">교육지원단</a></li>
                        <li><a href="service4.html">기업혁신 지원단</a></li>
                        <li><a href="service5.html">R&D 기획지원단</a></li>
                        <li><a href="service6.html">기술개발 네트워크 지원단</a></li>
                    </ul>
                </li>
                <li><a href="#news">성공사례 및 소식</a></li>
                <li><a href="#contact">상담&오시는길</a></li>
            </ul>
        </nav>
    `;

    const footer = `
        <footer>
            <p>© 2024 KISADAN. All rights reserved.</p>
        </footer>
    `;

    document.getElementById("navbar").innerHTML = navbar;
    document.body.insertAdjacentHTML('beforeend', footer);

    // 네비게이션 링크에 클릭 이벤트 추가
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault(); // 기본 링크 동작 방지
                const targetId = this.getAttribute('href');
                // 현재 URL의 기본 경로를 가져와서 해시 변경
                const baseUrl = window.location.origin + '/';
                window.location.href = baseUrl + targetId;
            }
        });
    });
});

