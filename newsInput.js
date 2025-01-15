let isAdmin = false;
let currentPassword = 'admin1234'; // 초기 비밀번호 설정

// 모든 필요한 DOM 요소 참조
const loginButton = document.getElementById('loginButton');
const setPasswordButton = document.getElementById('setPasswordButton');
const adminPassword = document.getElementById('adminPassword');
const newPasswordInput = document.getElementById('newPassword');
const addPostButton = document.getElementById('addPost');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const imageUpload = document.getElementById('imageUpload');
const successList = document.getElementById('successList');
const newsList = document.getElementById('newsList');
const postType = document.getElementById('postType');

// 페이지 로드 시 바로 게시물 표시
displayPosts();

// 로그인 버튼 클릭 이벤트
loginButton.addEventListener('click', function() {
    if (adminPassword.value === currentPassword) {
        isAdmin = true;
        document.querySelector('.upload-form').style.display = 'block';
        adminPassword.value = '';
        newPasswordInput.style.display = 'block';
        setPasswordButton.style.display = 'block';
        displayPosts(); // 관리자 로그인 후 게시물 다시 표시 (수정/삭제 버튼 표시를 위해)
    } else {
        alert('잘못된 비밀번호입니다.');
    }
});

// 비밀번호 설정 버튼 클릭 이벤트
setPasswordButton.addEventListener('click', function() {
    const newPassword = newPasswordInput.value;
    if (newPassword) {
        currentPassword = newPassword;
        newPasswordInput.value = '';
        alert('비밀번호가 성공적으로 변경되었습니다.');
    } else {
        alert('새 비밀번호를 입력하세요.');
    }
});

// 게시물 추가 버튼 이벤트
addPostButton.addEventListener('click', function() {
    const title = titleInput.value;
    const description = descriptionInput.value;
    const imageFile = imageUpload.files[0];
    const selectedType = postType.value;

    if (title && description && imageFile && isAdmin) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const newItem = {
                title: title,
                description: description,
                image: e.target.result,
                type: selectedType,
                fontSize: document.getElementById('fontSize').value,
                isBold: document.getElementById('fontWeight').checked,
                textColor: document.getElementById('textColor').value
            };

            try {
                // 로컬 스토리지에서 게시물 가져오기
                let posts = JSON.parse(localStorage.getItem('posts')) || { success: [], news: [] };
                
                // posts가 배열인 경우 새로운 형식으로 변환
                if (Array.isArray(posts)) {
                    const oldPosts = [...posts];
                    posts = {
                        success: oldPosts.filter(p => p.type === 'success'),
                        news: oldPosts.filter(p => p.type === 'news')
                    };
                }

                // 새 게시물 추가
                if (selectedType === 'success') {
                    posts.success.unshift(newItem);
                    if (posts.success.length > 15) {
                        posts.success.pop();
                    }
                } else if (selectedType === 'news') {
                    posts.news.unshift(newItem);
                    if (posts.news.length > 15) {
                        posts.news.pop();
                    }
                }

                // 로컬 스토리지에 저장
                localStorage.setItem('posts', JSON.stringify(posts));
                displayPosts();
                
                // 입력 필드 초기화
                titleInput.value = '';
                descriptionInput.value = '';
                imageUpload.value = '';
                
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('저장 공간이 부족합니다. 일부 게시물을 삭제하고 다시 시도해주세요.');
                } else {
                    console.error('저장 중 오류 발생:', e);
                    alert('저장 중 오류가 발생했습니다.');
                }
            }
        };

        reader.onerror = function(error) {
            console.error('이미지 읽기 오류:', error);
            alert('이미지를 읽는 중 오류가 발생했습니다.');
        };

        reader.readAsDataURL(imageFile);
    } else {
        alert('모든 필드를 입력하세요 및 관리자 권한이 필요합니다.');
    }
});

// 게시물 표시 함수
function displayPosts() {
    // 로컬 스토리지에서 게시물 가져오기
    const postsData = JSON.parse(localStorage.getItem('posts')) || { success: [], news: [] };
    
    // postsData가 배열인 경우 새로운 형식으로 변환
    let posts = postsData;
    if (Array.isArray(postsData)) {
        posts = {
            success: postsData.filter(p => p.type === 'success'),
            news: postsData.filter(p => p.type === 'news')
        };
        // 변환된 형식을 다시 저장
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    successList.innerHTML = '';
    newsList.innerHTML = '';

    // 성공사례 표시
    posts.success.forEach((post, index) => {
        displayPost(post, index, 'success', successList);
    });

    // 기사단 소식 표시
    posts.news.forEach((post, index) => {
        displayPost(post, index, 'news', newsList);
    });
}

// 개별 게시물 표시 함수
function displayPost(post, index, type, container) {
    const newItem = document.createElement('li');
    newItem.classList.add('news-item');
    newItem.innerHTML = `
        <div class="news-image">
            <img src="${post.image}" alt="${post.title}" />
        </div>
        <div class="news-text" style="font-size: ${post.fontSize}; color: ${post.textColor}; font-weight: ${post.isBold ? 'bold' : 'normal'};">
            <h4>${post.title}</h4>
            <p>${post.description.replace(/\n/g, '<br>')}</p>
            ${isAdmin ? `
                <button class="editPost">수정</button>
                <button class="savePost" style="display: none;">수정 완료</button>
                <button class="deletePost">삭제</button>
            ` : ''}
        </div>
    `;

    container.appendChild(newItem);

    if (isAdmin) {
        // 수정 버튼 이벤트 추가
        newItem.querySelector('.editPost').addEventListener('click', function() {
            titleInput.value = post.title;
            descriptionInput.value = post.description;
            document.getElementById('fontSize').value = post.fontSize;
            document.getElementById('fontWeight').checked = post.isBold;
            document.getElementById('textColor').value = post.textColor;

            newItem.querySelector('.savePost').style.display = 'inline-block';
            newItem.querySelector('.editPost').style.display = 'none';

            // 수정 완료 버튼 클릭 시 로컬 스토리지 업데이트
            newItem.querySelector('.savePost').onclick = function() {
                const posts = JSON.parse(localStorage.getItem('posts'));
                
                posts[type][index] = {
                    ...posts[type][index],
                    title: titleInput.value,
                    description: descriptionInput.value,
                    fontSize: document.getElementById('fontSize').value,
                    isBold: document.getElementById('fontWeight').checked,
                    textColor: document.getElementById('textColor').value
                };

                localStorage.setItem('posts', JSON.stringify(posts));
                displayPosts();

                // 입력 필드 초기화
                titleInput.value = '';
                descriptionInput.value = '';
            };
        });

        // 삭제 버튼 이벤트 추가
        newItem.querySelector('.deletePost').addEventListener('click', function() {
            if (confirm('정말 이 게시물을 삭제하시겠습니까?')) {
                const posts = JSON.parse(localStorage.getItem('posts'));
                posts[type].splice(index, 1);
                localStorage.setItem('posts', JSON.stringify(posts));
                displayPosts();
            }
        });
    }
}