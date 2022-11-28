variable "my_access_key" {
    description = "Access-key-for-AWS"
    default = "no_access_key_value_found"
}

variable "my_secret_key" {
    description = "Secret-key-for-AWS"
    default = "no_secret_key_value_found"
}

output "access_key_is" {
    value = var.my_access_key
}

output "secret_key_is" {
    value = var.my_secret_key
}

provider "aws" {
    region = "eu-west-3"
    access_key = var.my_access_key
    secret_key = var.my_secret_key
}

resource "aws_instance" "example" {
    ami = "ami-0357d42faf6fa582f"
    instance_type = "t2.micro"

    user_data = <<-EOF
	        #!/bin/bash
		    sudo yum update -y
		    sudo yum -y install httpd -y
		    sudo service httpd start
		    echo "Hello world from EC2 $(hostname -f)" > /var/www/html/index.html
		    EOF

    tags = {
        Name = "My first EC2 using Terraform"
    }
    vpc_security_group_ids = [aws_security_group.instance.id]
}

resource "aws_security_group" "instance" {
    name = "terraform-tcp-security-group"

    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}
