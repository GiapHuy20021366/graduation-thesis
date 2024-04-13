import "../../styles/NoAccess.scss";

export default function NoAccess() {
  return (
    <div id="noaccess">
      <div className="lock"></div>
      <div className="message">
        <h1>Bạn hiện không có quyền truy cập</h1>
        <p>Vui lòng liên hệ với quản trị viên nếu đây là một lỗi.</p>
      </div>
    </div>
  );
}
