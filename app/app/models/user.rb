class User < ActiveRecord::Base
  attr_accessible :email, :name

  validates :email, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create }
  validates_uniqueness_of :email

  has_many :auth_tokens

  def self.authenticate(auth_token)
    token = AuthToken.active.find_by_token(auth_token)
    return token.user if token
  end
end
