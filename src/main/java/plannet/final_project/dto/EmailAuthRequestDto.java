package plannet.final_project.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;

@Setter
@Getter
@ToString
public class EmailAuthRequestDto {
    @NotEmpty(message = "이메일을 입력해주세요")
    public String email;
}